import { observable } from 'mobx';

export enum UserState {
    login,
    signup,
    connected
}

export class CommonStore {
    @observable userState: UserState = UserState.login;
}
