import { observable, action } from 'mobx';
import { MediaController } from '@openapi/routes'
import { MediaCredentials } from '@openapi/schemas'

export enum SpotifyScope {
    playback = 'user-read-playback-state',
    playlist = 'playlist-modify-public'
}

export class SettingStore {

    @observable playbackCredential: MediaCredentials | undefined = undefined;
    @observable playlistCredential: MediaCredentials | undefined = undefined;

    @action
    obtainPlaybackCredential = async () => {
        try {
            this.playbackCredential = undefined;
            let data: MediaCredentials[] = await MediaController.find(SpotifyScope.playback);
            if (data.length > 0)
                this.playbackCredential = data[0];
        } catch (error) {
            console.error(error);
        }
    }

    @action
    obtainPlaylistCredential = async () => {
        try {
            this.playlistCredential = undefined;
            let data: MediaCredentials[] = await MediaController.find(SpotifyScope.playlist);
            if (data.length > 0)
                this.playlistCredential = data[0];
        } catch (error) {
            console.error(error);
        }
    }

    @action
    deleteCredential = async (scope: SpotifyScope) => {
        switch (scope) {
            case SpotifyScope.playback:
                await this.deletePlaybackCredential();
                break;
            case SpotifyScope.playlist:
                await this.deletePlaylistCredential();
                break;
        }
    }

    private deletePlaybackCredential = async () => {
        try {
            if (this.playbackCredential !== undefined) {
                if (this.playbackCredential.id !== undefined)
                    await MediaController.deleteById(this.playbackCredential.id)
                this.playbackCredential = undefined;
            }
        } catch (error) {
            console.error(error);
        }
    }

    private deletePlaylistCredential = async () => {
        try {
            if (this.playlistCredential !== undefined) {
                if (this.playlistCredential.id !== undefined)
                    await MediaController.deleteById(this.playlistCredential.id)
                this.playlistCredential = undefined;
            }
        } catch (error) {
            console.error(error);
        }
    }
}
