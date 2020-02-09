import { observable, action } from 'mobx';
import request from 'superagent'
import * as config from '../../../config.json';

const LOOPBACK_URL: string = config.loopback

export enum UserState {
    login,
    signup,
    connected
}

interface IUser {
    id: string,
    firstName: string,
    lastName: string,
    email: string
}

export class UserStore {
    @observable state: UserState = UserState.login;

    @observable userNotFound: string | null = null;
    @observable emailError: string | null = null;
    @observable passwordError: string | null = null;

    @observable firstName: string = '';
    @observable lastName: string = '';
    @observable email: string = '';
    @observable password: string = '';
    id: string = '';

    @action
    createAccount = async () => {
        try {
            const response = await request
                .post(LOOPBACK_URL + 'users/register')
                .send({
                    firstName: this.firstName,
                    lastName: this.lastName,
                    email: this.email,
                    password: this.password
                })
                .set('Accept', 'application/json');

            if (response.status === 200) {
                let user: IUser = response.body;
                this.id = user.id;
                this.firstName = user.firstName;
                this.lastName = user.lastName;
                this.email = user.email;
                this.login();
            }
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
            const response = await request
                .post(LOOPBACK_URL + 'users/login')
                .send({
                    email: this.email,
                    password: this.password
                })
                .set('Accept', 'application/json')

            if (response.status === 204) {
                this.emailError = null;
                this.userNotFound = null;
                this.passwordError = null;
                this.state = UserState.connected;
            }
        } catch (error) {
            if (error.status === 422 || error.status === 401) {
                this.userNotFound = 'Invalid email or password.';
            }
        }
    }

    @action
    cookieLogin = async () => {
        try {
            const response = await request
                .get(LOOPBACK_URL + 'users/me')
                .set('Accept', 'application/json')

            if (response.status === 200) {
                let user: IUser = response.body;
                this.id = user.id;
                this.userInfo();
            }
        } catch (error) {
            console.log('Cookie Login Error : ' + error);
        }
    }

    @action
    userInfo = async () => {
        try {
            const response = await request
                .get(LOOPBACK_URL + 'users/' + this.id)
                .set('Accept', 'application/json')

            if (response.status === 200) {
                let user: IUser = response.body;
                this.firstName = user.firstName;
                this.lastName = user.lastName;
                this.email = user.email;
                this.state = UserState.connected;
            }
        } catch (error) {
            console.log(error);
        }
    }

    @action
    logout = async () => {
        try {
            const response = await request
                .post(LOOPBACK_URL + 'users/logout');

            if (response.status === 204) {
                this.state = UserState.login;
                this.firstName = '';
                this.lastName = '';
                this.email = '';
                this.password = '';
            }
        } catch (error) {
            console.log(error);
        }
    }
}
