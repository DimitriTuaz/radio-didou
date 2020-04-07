import { observable, action } from 'mobx';
import { MediaController, NowController } from '@openapi/routes'
import { MediaCredentials, User, NowState } from '@openapi/schemas'

import { RootStore } from '../contexts';
import { UserPower } from '../stores';
import { NowEnum } from './SongStore';

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
    @observable nowState: NowState | undefined;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @action
    refresh = async () => {
        this.obtainCredential(SpotifyScope.playback);
        this.obtainCredential(SpotifyScope.playlist);
        this.obtainNowUsers();
        this.obtainNowState();
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
                    if (scope === SpotifyScope.playback) {
                        if (this.nowState?.userId === this.rootStore.userStore.user.id) {
                            await NowController.setMedia({ type: NowEnum.None });
                            this.nowState = undefined;
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
        if (this.rootStore.userStore.user.power >= UserPower.ADMIN) {
            try {
                this.nowUsers = await NowController.findMedia();
            } catch (error) {
                console.error(error);
            }
        }
    }

    @action
    obtainNowState = async () => {
        if (this.rootStore.userStore.user.power >= UserPower.ADMIN) {
            try {
                this.nowState = await NowController.getMedia();
            } catch (error) {
                console.error(error);
            }
        }
    }
}
