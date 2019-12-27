import React from 'react';
import '../App.less';
import icon_play from '../images/icon_play.png'
import icon_sound from '../images/icon_sound.png'
import icon_sound_low from '../images/icon_sound_low.png'
import icon_mute from '../images/icon_mute.png'
import { Dimmer, Loader } from 'semantic-ui-react'
import superagent from 'superagent'

import * as config from '../../../config.json';

var SERVER_URL: string = 'http://' + config.domain
var ICECAST_URL: string = 'http://37.59.99.228'
var ICECAST_PORT: string = ':8889'
var STREAM_URL: string = ICECAST_URL + ICECAST_PORT + '/radio-didou';
var ICECAST_STATUS_URL: string = ICECAST_URL + ICECAST_PORT + '/status-json.xsl';
var CURRENT_TRACK_URL: string = SERVER_URL + ':' + config.rest.port + '/now/get';

interface IProps {
}

interface IState {
  mute: boolean;
  volume: number;
  playing: boolean;
  loading: boolean;
  trackCover?: string;
  trackTitle?: string;
  trackArtists?: string;
  trackAlbum?: string;
  auditorCount?: number;
}

class Home extends React.Component<IProps, IState> {

  _isMounted: boolean = false;
  audio: HTMLAudioElement = new Audio();
  trackUrl: string = '';
  currentTrackIntervalId: number = 0;
  auditorCountIntervalId: number = 0;

  constructor(props: IProps) {
    super(props);

    this.state = {
      mute: false,
      volume: 1,
      playing: false,
      loading: false,
      trackCover: undefined,
      trackTitle: undefined,
      trackArtists: undefined,
      trackAlbum: undefined,
      auditorCount: undefined
    };

    this.onPlaying = this.onPlaying.bind(this);
    this.getCurrentTrack = this.getCurrentTrack.bind(this);
    this.getAuditorCount = this.getAuditorCount.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.onMute = this.onMute.bind(this);
    this.onChangeVolume = this.onChangeVolume.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.audio.onplaying = this.onPlaying;
    this.getCurrentTrack();
    this.getAuditorCount();
    this.currentTrackIntervalId = window.setInterval(this.getCurrentTrack, 10000);
    this.auditorCountIntervalId = window.setInterval(this.getAuditorCount, 1000);
  }

  componentWillUnmount() {
    this._isMounted = false;
    clearInterval(this.currentTrackIntervalId);
    clearInterval(this.auditorCountIntervalId);
  }

  getCurrentTrack() {
    superagent
      .get(CURRENT_TRACK_URL)
      .set('Accept', 'application/json')
      .then(
        res => {
          if (res.status && res.status === 200 && this._isMounted) {
            if (res.body.item !== undefined) {
              // Add year of release for the ablum
              var album: string = res.body.item.album.name + " (" + res.body.item.album.release_date.substring(0, 4) + ")";
              // There can be mutliple artists
              var artists: string = "";
              res.body.item.artists.forEach((item: any, index: number) => {
                artists += item.name;
                if (index < res.body.item.artists.length - 1) {
                  artists += ", ";
                }
              })
              this.trackUrl = res.body.item.external_urls.spotify;
              // setState only if track has changed
              if (res.body.item.name !== this.state.trackTitle && artists !== this.state.trackArtists) {
                this.setState({
                  trackCover: res.body.item.album.images[1].url,
                  trackTitle: res.body.item.name,
                  trackArtists: artists,
                  trackAlbum: album
                })

                if (navigator !== undefined && 'mediaSession' in navigator) {
                  // Hack for TypeScript 'navigator may be undefined' warning
                  const navigatorConst: any = navigator;
                  navigatorConst.mediaSession.metadata = new MediaMetadata({
                    title: res.body.item.name,
                    artist: artists,
                    album: album,
                    artwork: [
                      { src: 'res.body.item.album.images[1].url', sizes: '300x300', type: 'image/jpg' }
                    ]
                  });
                }
              }
            }
          }
        }
      )
  }

  getAuditorCount() {
    superagent
      .get(ICECAST_STATUS_URL)
      .set('Accept', 'application/json')
      .then(
        res => {
          if (res.status && res.status === 200 && this._isMounted) {
            var newAuditorCount: number = 0;
            if (res.body.icestats !== undefined && res.body.icestats.source[0] !== undefined) {
              newAuditorCount = res.body.icestats.source[0].listeners;
            }
            else if (res.body.icestats !== undefined && res.body.icestats.source !== undefined) {
              newAuditorCount = res.body.icestats.source.listeners;
            }
            else {
              this.setState({ auditorCount: undefined })
              return;
            }

            // setState only if auditor count has changed
            if (this.state.auditorCount !== newAuditorCount) {
              this.setState({ auditorCount: newAuditorCount });
            }
          }
        }
      )
  }

  onPlaying(): void {
    this.setState({ playing: true, loading: false });
  }

  onPlay(): void {
    this.setState({ playing: true, loading: true })
    // Force reloading the stream when hitting play button
    this.audio.src = '';
    this.audio.src = STREAM_URL;
    this.audio.load();
    this.audio.play();
  }

  onMute(): void {
    this.audio.muted = !this.state.mute;
    this.setState({ mute: !this.state.mute });
  }

  onChangeVolume(e: React.FormEvent<HTMLInputElement>): void {
    this.audio.volume = parseFloat(e.currentTarget.value);
    this.setState({ volume: parseFloat(e.currentTarget.value)});
  }

  render() {
    const isMobile = window.innerWidth <= 1000;
    return (
      <div className='main-container'>
        <Dimmer active={this.state.playing && this.state.loading}>
          <Loader className='unselectable'>Chargement...</Loader>
        </Dimmer>
        <div className={'title-container' + (isMobile ? '-mobile' : '') + ' unselectable'}>
          <p className={'title' + (isMobile ? '-mobile' : '')}>Radio Didou</p>
        </div>
        <div className={'player-container' + (isMobile ? '-mobile' : '')}>
          <button className={'icon-sound' + (isMobile ? '-mobile' : '')} onClick={this.onPlay}>
            <img src={icon_play} alt=''></img>
          </button>
          <button className={'icon-sound' + (isMobile ? '-mobile' : '')} onClick={this.onMute}>
            <img src={this.state.mute ? icon_mute : (this.state.volume > 0.5 ? icon_sound : icon_sound_low)} alt=''></img>
          </button>
          <div className={'volume-slider-wrapper' + (isMobile ? '-mobile' : '')}>
            <input
              min={0}
              max={1}
              onChange={this.onChangeVolume}
              step='any'
              type='range'
              value={this.state.volume}
            />
          </div>
        </div>

        <div className={'track-container' + (isMobile ? '-mobile' : '')} onClick={() => { window.open(this.trackUrl, '_blank') }}>
          <div className='track-cover-container' >
            <img className={'track-cover' + (isMobile ? '-mobile' : '')} src={this.state.trackCover} alt=''></img>
          </div>
          <div className={'track-infos-container' + (isMobile ? '-mobile' : '')}>
            <p className={'track-title' + (isMobile ? '-mobile' : '')}>{this.state.trackTitle}</p>
            <p className={'track-artists' + (isMobile ? '-mobile' : '')}>{this.state.trackArtists}</p>
            <p className={'track-album' + (isMobile ? '-mobile' : '')}>{this.state.trackAlbum}</p>
          </div>
        </div>

        <div className='current-listeners-container unselectable'>
          <p className={'current-listeners' + (isMobile ? '-mobile' : '')}>
            {this.state.auditorCount === undefined ? '' : this.state.auditorCount + ' auditeur' + (this.state.auditorCount > 1 ? 's' : '') + ' actuellement'}
          </p>
        </div>
      </div>
    );
  }
}

export default Home;
