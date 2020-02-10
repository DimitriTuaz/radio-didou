import { action, observable } from "mobx";
import { NowController } from '@openapi/routes'
import { NowObject } from '@openapi/schemas'


export class MainStore {
    @observable sidebarVisible: boolean = false;
    @observable loginModalVisible: boolean = false;

    @observable trackCover: string | undefined = undefined;
    @observable trackTitle: string | undefined = undefined;
    @observable trackArtists: string | undefined = undefined;
    @observable trackAlbum: string | undefined = undefined;
    @observable trackUrl: string = "";
    @observable auditorCount: number | undefined = undefined;

    currentTrackIntervalId: number = 0;

    @action
    showSidebar = (show: boolean): void => {
        this.sidebarVisible = show;
    }

    @action
    showLoginModal = (show: boolean): void => {
        this.loginModalVisible = show;
    }

    @action
    getCurrentTrack = async () => {
        try {
            let now: NowObject = await NowController.getNow();
            let trackCover: string = now.cover ? now.cover : '';
            let trackAlbum: string = now.album ? now.album : '';
            let trackTitle: string = now.song;
            let trackArtists: string = '';
            let trackUrl: string = now.url ? now.url : '';
            let auditorCount: number = now.listeners;

            if (now.artists !== undefined) {
                now.artists.forEach((name: any, index: number) => {
                    trackArtists += name;
                    if (index < now.artists.length - 1) {
                        trackArtists += ", ";
                    }
                })
            }
            if (now.release_date !== undefined) {
                trackAlbum += " (" + now.release_date.substring(0, 4) + ")";
            }
            if (trackTitle !== this.trackTitle || trackArtists !== this.trackArtists) {
                this.trackCover = trackCover;
                this.trackTitle = trackTitle;
                this.trackArtists = trackArtists;
                this.trackAlbum = trackAlbum;
                this.trackUrl = trackUrl;
                if (navigator !== undefined && navigator.mediaSession !== undefined) {
                    navigator.mediaSession.metadata = new MediaMetadata({
                        title: trackTitle,
                        artist: trackArtists,
                        album: trackAlbum,
                        artwork: [
                            { src: trackCover, sizes: '300x300', type: 'image/jpg' }
                        ]
                    });
                }
            }
            this.auditorCount = auditorCount
        } catch (error) {
            console.error(error);
        }
    }
}
