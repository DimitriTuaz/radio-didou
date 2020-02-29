import { observable, action } from 'mobx';
import { MediaController, NowController } from '@openapi/routes'
import { MediaCredentials, User } from '@openapi/schemas'

import { RootStore } from '../contexts';

export enum UserPower {
    NONE = 0,
    DJ = 5,
    ADMIN = 10
}

export enum SpotifyScope {
    playback = 'user-read-playback-state',
    playlist = 'playlist-modify-public'
}

type ScopedCredentials = { [key in SpotifyScope]: MediaCredentials | undefined };

export class SettingStore {

    private rootStore: RootStore;

    @observable credentials: ScopedCredentials = {
        [SpotifyScope.playback]: undefined,
        [SpotifyScope.playlist]: undefined
    };

    @observable nowUsers: User[] = [];
    @observable currentNowUser: User | undefined;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @action
    refresh = async () => {
        this.obtainCredential(SpotifyScope.playback);
        this.obtainCredential(SpotifyScope.playlist);
        this.obtainCurrentNowUser();
        this.obtainNowUsers();
    }

    @action
    obtainCredential = async (scope: SpotifyScope) => {
        try {
            this.credentials[scope] = undefined;
            let data: MediaCredentials[] = await MediaController.find(scope);
            if (data.length > 0)
                this.credentials[scope] = data[0];
        } catch (error) {
            console.error(error);
        }
    }

    @action
    deleteCredential = async (scope: SpotifyScope) => {
        try {
            if (this.credentials[scope] !== undefined) {
                let credentialId = this.credentials[scope]?.id;
                if (credentialId !== undefined) {
                    await MediaController.deleteById(credentialId);
                    if (scope == SpotifyScope.playback) {
                        if (this.currentNowUser?.id === this.rootStore.userStore.user.id) {
                            await NowController.setMedia('undefined');
                            this.currentNowUser = undefined;
                        }
                        this.obtainNowUsers();
                    }
                }
                this.credentials[scope] = undefined;
            }
        } catch (error) {
            console.error(error);
        }
    }

    @action
    obtainNowUsers = async () => {
        if (this.rootStore.userStore.user.power !== undefined
            && this.rootStore.userStore.user.power >= UserPower.ADMIN) {
            try {
                this.nowUsers = await NowController.findMedia();
            } catch (error) {
                console.error(error);
            }
        }
    }

    @action
    obtainCurrentNowUser = async () => {
        if (this.rootStore.userStore.user.power !== undefined
            && this.rootStore.userStore.user.power >= UserPower.ADMIN) {
            try {
                let users: User[] = await NowController.getMedia();
                this.currentNowUser = users[0];
            } catch (error) {
                console.error(error);
            }
        }
    }
}
