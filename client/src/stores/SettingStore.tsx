import { observable, action } from 'mobx';
import { MediaController, NowController } from '@openapi/routes'
import { MediaCredentials, User } from '@openapi/schemas'

import { RootStore } from '../contexts';

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

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @action
    refresh = async () => {
        this.obtainCredential(SpotifyScope.playback);
        this.obtainCredential(SpotifyScope.playlist);
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
                if (credentialId !== undefined)
                    await MediaController.deleteById(credentialId);
                this.credentials[scope] = undefined;
            }
        } catch (error) {
            console.error(error);
        }
    }

    @action
    obtainNowUsers = async () => {
        if (this.rootStore.userStore.user.power !== undefined
            && this.rootStore.userStore.user.power >= 10) {
            try {
                this.nowUsers = await NowController.findMedia();
            } catch (error) {
                console.error(error);
            }
        }
    }
}
