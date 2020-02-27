import { observable, action } from 'mobx';
import { MediaController } from '@openapi/routes'
import { MediaCredentials } from '@openapi/schemas'

export enum SpotifyScope {
    playback = 'user-read-playback-state',
    playlist = 'playlist-modify-public'
}

type ScopedCredentials = { [key in SpotifyScope]: MediaCredentials | undefined };

export class SettingStore {

    @observable credentials: ScopedCredentials = {
        [SpotifyScope.playback]: undefined,
        [SpotifyScope.playlist]: undefined
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
}
