import { observable, action } from 'mobx';
import { SongController } from '@openapi/routes'
import { Song } from '@openapi/schemas'

import { RootStore } from '../contexts';

export enum SongState {
    liked,
    unliked
}

export class SongStore {

    private rootStore: RootStore;

    @observable state: SongState = SongState.unliked;
    @observable songs: Song[] = [];

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @action
    add = async (url: string) => {
        try {
            let song: Song = (await SongController.add(url)) as Song;
            this.songs.push(song);
            this.state = SongState.liked;
        } catch (error) {
            console.error(error);
        }
    }

    @action
    remove = async (url: string) => {
        try {
            await SongController.remove(url);
            this.songs = this.songs.filter((value: Song) => {
                return value.url !== url;
            });
            if (this.rootStore.nowStore.trackUrl === url) {
                this.state = SongState.unliked;
            }
        } catch (error) {
            console.error(error);
        }
    }

    @action
    refresh = async () => {
        try {
            let isLiked: boolean = await SongController.is(this.rootStore.nowStore.trackUrl);
            this.state = isLiked ? SongState.liked : SongState.unliked;
        } catch (error) {
            console.error(error);
        }
    }

    @action
    get = async () => {
        try {
            this.songs = (await SongController.get()) as Song[];
        } catch (error) {
            console.error(error);
        }
    }
}
