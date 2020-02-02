import { action, observable } from "mobx";
import superagent from 'superagent'
import { INow } from '@common/now/now.common'
import * as config from '../../../config.json';

var LOOPBACK_URL: string = config.loopback
var CURRENT_TRACK_URL: string = LOOPBACK_URL + 'now/get';

export class MainStore {
    @observable sidebarVisible: boolean = false;

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
    getCurrentTrack = (): void  => {
        superagent
            .get(CURRENT_TRACK_URL)
            .set('Accept', 'application/json')
            .then(
                res => {
                    if (res.status && res.status === 200) {
                        let now: INow = res.body;
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
                        // update values only if track has changed
                        if (trackTitle !== this.trackTitle || trackArtists !== this.trackArtists) {
                            this.trackCover = trackCover;
                            this.trackTitle = trackTitle;
                            this.trackArtists = trackArtists;
                            this.trackAlbum = trackAlbum;
                            this.trackUrl = trackUrl;

                            if (navigator !== undefined && 'mediaSession' in navigator) {
                                // Hack for TypeScript 'navigator may be undefined' warning
                                const navigatorConst: any = navigator;
                                navigatorConst.mediaSession.metadata = new MediaMetadata({
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
                    }
                }
            )
        }
}