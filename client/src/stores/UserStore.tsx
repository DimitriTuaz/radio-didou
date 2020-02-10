import { observable, action } from 'mobx';
import { UserController } from '@openapi/routes'
import { User } from '@openapi/schemas'

export enum UserState {
    login,
    signup,
    connected
}

export class UserStore {
    @observable state: UserState = UserState.login;

    @observable userNotFound: string | null = null;
    @observable emailError: string | null = null;
    @observable passwordError: string | null = null;

    @observable user: User = {
        email: '',
        firstName: '',
        lastName: ''
    };
    @observable password: string = '';

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
            this.state = UserState.connected;

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
                this.state = UserState.connected;
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
            this.state = UserState.login;
        } catch (error) {
            console.error(error);
        }
    }
}
