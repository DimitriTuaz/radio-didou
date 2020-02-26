import { observable, action } from 'mobx';
import { UserController } from '@openapi/routes'
import { User } from '@openapi/schemas'
import { CommonStore } from './CommonStore';
import { MainStore } from './MainStore';
import { SongStore, SongState } from './SongStore';

enum UserState {
    login,
    signup,
    connected
}

export class UserStore {

    private commonStore: CommonStore;
    private mainStore: MainStore;
    private songStore: SongStore;

    @observable loginLoading: boolean = false;
    @observable signupLoading: boolean = false;
    @observable userNotFound: boolean = false;
    @observable emailError: string | null = null;
    @observable passwordError: boolean = false;
    @observable lastNameError: boolean = false;
    @observable firstNameError: boolean = false;
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
            this.emailError = (this.user.email === '' ? 'L’email ne peut pas être vide' : null);
            this.passwordError = (this.password.length < 6);
            this.firstNameError = (this.user.firstName === '');
            this.lastNameError = (this.user.lastName === '');
            if (this.emailError || this.firstNameError || this.lastNameError || this.passwordError) {
                return;
            }
            this.signupLoading = true;
            this.user = await UserController.register({
                firstName: this.user.firstName,
                lastName: this.user.lastName,
                email: this.user.email,
                password: this.password
            });
            this.signupLoading = false;
            await this.login();

        } catch (error) {
            this.signupLoading = false;
            if (error.status === 409) {
                this.emailError = 'Cette addresse email est déjà utilisée';
            }
            if (error.status === 422) {
                this.passwordError = true;
            }
        }
    }

    @action
    login = async () => {
        try {
            this.loginLoading = true;
            await UserController.login({
                email: this.user.email,
                password: this.password
            });
            this.loginLoading = false;
            this.userNotFound = false;
            if (!(this.commonStore.userState === UserState.connected)) {
                this.commonStore.userState = UserState.connected;
                await this.cookieLogin();
                await this.songStore.refresh(this.mainStore.trackUrl);
            }

        } catch (error) {
            this.loginLoading = false;
            if (error.status === 422 || error.status === 401) {
                this.userNotFound = true;
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
