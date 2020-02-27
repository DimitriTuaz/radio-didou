import { observable, action } from 'mobx';
import { NowController } from '@openapi/routes'
import { NowCredentials } from '@openapi/schemas'


export class SettingStore {

    public static scope_playback: string = 'user-read-playback-state';
    public static scope_playlist: string = 'playlist-modify-public';

    @observable playbackCredential: NowCredentials | undefined = undefined;
    @observable playlistCredential: NowCredentials | undefined = undefined;

    @action
    obtainPlaybackCredential = async () => {
        try {
            let data: NowCredentials[] = await NowController.find(SettingStore.scope_playback);
            if (data.length > 0)
                this.playbackCredential = data[0];
        } catch (error) {
            console.error(error);
        }
    }

    @action
    obtainPlaylistCredential = async () => {
        try {
            let data: NowCredentials[] = await NowController.find(SettingStore.scope_playlist);
            if (data.length > 0)
                this.playlistCredential = data[0];
        } catch (error) {
            console.error(error);
        }
    }

    @action
    deletePlaybackCredential = async () => {
        try {
            if (this.playbackCredential !== undefined) {
                if (this.playbackCredential.id !== undefined)
                    await NowController.deleteById(this.playbackCredential.id)
                this.playbackCredential = undefined;
            }
        } catch (error) {
            console.error(error);
        }
    }

    @action
    deletePlaylistCredential = async () => {
        try {
            if (this.playlistCredential !== undefined) {
                if (this.playlistCredential.id !== undefined)
                    await NowController.deleteById(this.playlistCredential.id)
                this.playlistCredential = undefined;
            }
        } catch (error) {
            console.error(error);
        }
    }
}
