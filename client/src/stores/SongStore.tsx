import { observable, action } from 'mobx';
import { SongController } from '@openapi/routes'

export enum SongState {
    liked,
    unliked
}

export class SongStore {
    @observable state: SongState = SongState.unliked;

    @action
    add = async (url: string) => {
        try {
            await SongController.add(url);
        } catch (error) {
            console.error(error);
        }
    }
}
