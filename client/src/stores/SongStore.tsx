import { observable, action } from 'mobx';
import { SongController } from '@openapi/routes'
import { Song } from '@openapi/schemas'

export enum SongState {
    liked,
    unliked
}

export class SongStore {

    @observable state: SongState = SongState.unliked;
    @observable songs: Song[] = [];

    @action
    add = async (url: string) => {
        try {
            let song: Song = await SongController.add(url);
            this.songs.push(song);
            this.state = SongState.liked;
        } catch (error) {
            console.error(error);
        }
    }

    @action
    remove = async (current_url: string, url: string) => {
        try {
            await SongController.remove(url);
            this.songs = this.songs.filter((value: Song) => {
                return value.url !== url;
            });
            if (current_url === url) {
                this.state = SongState.unliked;
            }
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

    @action
    get = async () => {
        try {
            this.songs = await SongController.get();
        } catch (error) {
            console.error(error);
        }
    }
}
