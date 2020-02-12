import { observable, action } from 'mobx';
import { UserController } from '@openapi/routes'
import { User } from '@openapi/schemas'
import { CommonStore } from './CommonStore';
import { MainStore } from './MainStore';
import { SongStore, SongState } from './SongStore';

export enum UserState {
    login,
    signup,
    connected
}

export class UserStore {

    private commonStore: CommonStore;
    private mainStore: MainStore;
    private songStore: SongStore;

    @observable userNotFound: string | null = null;
    @observable emailError: string | null = null;
    @observable passwordError: string | null = null;
    @observable user: User = {
        email: '',
        firstName: '',
        lastName: ''
    };
    @observable password: string = '';

    constructor(commonStore: CommonStore, mainStore: MainStore, songStore: SongStore) {
        this.commonStore = commonStore;
        this.mainStore = mainStore;
        this.songStore = songStore;
    }

    @action
    createAccount = async () => {
        try {
            this.user = await UserController.register({
                firstName: this.user.firstName,
                lastName: this.user.lastName,
                email: this.user.email,
                password: this.password
            });
            await this.login();

        } catch (error) {
            if (error.status === 409) {
                this.emailError = 'Email not avalaible';
                this.passwordError = null;
            }
            if (error.status === 422) {
                this.passwordError = 'must contains at least 6 characters'
                this.emailError = null;
            }
        }
    }

    @action
    login = async () => {
        try {
            await UserController.login({
                email: this.user.email,
                password: this.password
            });

            this.emailError = null;
            this.userNotFound = null;
            this.passwordError = null;
            if (!(this.commonStore.userState === UserState.connected)) {
                this.commonStore.userState = UserState.connected;
                await this.songStore.refresh(this.mainStore.trackUrl);
            }

        } catch (error) {
            if (error.status === 422 || error.status === 401) {
                this.userNotFound = 'Invalid email or password.';
            }
            console.error(error);
        }
    }

    @action
    cookieLogin = async () => {
        try {
            let user: User = await UserController.currentUser()
            this.user.id = user.id;
            await this.userInfo();
        } catch (error) {
            console.error('Cookie Login Error : ' + error);
        }
    }

    @action
    userInfo = async () => {
        try {
            if (this.user.id !== undefined) {
                this.user = await UserController.findById(this.user.id);
                if (!(this.commonStore.userState === UserState.connected)) {
                    this.commonStore.userState = UserState.connected;
                    await this.songStore.refresh(this.mainStore.trackUrl);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    @action
    logout = async () => {
        try {
            await UserController.logout();
            this.user = {
                email: '',
                firstName: '',
                lastName: ''
            };
            this.password = '';
            this.commonStore.userState = UserState.login;
            this.songStore.state = SongState.unliked;
        } catch (error) {
            console.error(error);
        }
    }
}
