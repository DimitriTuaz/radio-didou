import { observable, action } from 'mobx';
import { NowController } from '@openapi/routes'
import { NowCredentials } from '@openapi/schemas'


export class SettingStore {

    @observable playbackCredential: NowCredentials | undefined = undefined;
    @observable playlistCredential: NowCredentials | undefined = undefined;

    @action
    obtainPlaybackCredential = async () => {
        try {
            let data: NowCredentials[] = await NowController.show();
            this.playbackCredential = data[0];
            console.log('?');
        } catch (error) {
            console.error(error);
        }
    }

    @action
    obtainPlaylistCredential = async () => {
        try {
            let data: NowCredentials[] = await NowController.show();
            this.playlistCredential = data[0];
            console.log('?');
        } catch (error) {
            console.error(error);
        }
    }
}
