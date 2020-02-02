import { observable, action } from 'mobx';
import superagent from 'superagent'
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
    @observable userNotFound: boolean = false;

    @observable firstName: string = '';
    @observable lastName: string = '';
    @observable email: string = '';
    @observable password: string = '';
    id: string = '';

    @action
    createAccount = () => {
        superagent
            .post(LOOPBACK_URL + 'users')
            .send( {
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                password: this.password
            })
            .set('Accept', 'application/json')
            .then(
                res => {
                    if (res.status && res.status === 200) {
                        let user: IUser = res.body;
                        this.id = user.id;
                        this.firstName = user.firstName;
                        this.lastName = user.lastName;
                        this.email = user.email;
                        this.login();
                    }
                }
            )
            .catch((err) => {console.log(err)})
    }

    @action
    login = () => {
        superagent
            .post(LOOPBACK_URL + 'users/login')
            .send( {
                email: this.email,
                password: this.password
            })
            .set('Accept', 'application/json')
            .then(
                res => {
                    if (res.status && res.status === 200) {
                        this.userNotFound = false;
                        this.state = UserState.connected;
                    }
                }
            )
            .catch(
                err => {
                    if (err.status === 422) {
                        this.userNotFound = true;
                    }
                }
            )
    }

    @action
    cookieLogin = () => {
        superagent
            .get(LOOPBACK_URL + 'users/me')            
            .set('Accept', 'application/json')
            .then(
                res => {
                    if (res.status && res.status === 200) {
                        let user: IUser = res.body;
                        this.id = user.id;
                        this.userInfo();
                    }
                }
            )
            .catch(
                err => {
                    console.log('Cookie Login Error : ' + err);
                }
            )
    }

    @action
    userInfo = () => {
        superagent
            .get(LOOPBACK_URL + 'users/' + this.id)            
            .set('Accept', 'application/json')
            .then(
                res => {
                    if (res.status && res.status === 200) {
                        let user: IUser = res.body;
                        this.firstName = user.firstName;
                        this.lastName = user.lastName;
                        this.email = user.email;
                        this.state = UserState.connected;
                    }
                }
            )
            .catch((err) => {console.log(err)})
    }

    @action
    logout = () => {
        this.state = UserState.login;
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.password = '';
    }
}