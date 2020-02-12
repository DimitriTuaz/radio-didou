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
            this.state = SongState.liked;
        } catch (error) {
            console.error(error);
        }
    }

    @action
    remove = async (url: string) => {
        try {
            await SongController.remove(url);
            this.state = SongState.unliked;
        } catch (error) {
            console.error(error);
        }
    }

    @action
    refresh = async (url: string) => {
        try {
            let isLiked: boolean = await SongController.is(url);
            this.state = isLiked ? SongState.liked : SongState.unliked;
        } catch (error) {
            console.error(error);
        }
    }
}
