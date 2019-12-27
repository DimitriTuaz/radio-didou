import React from 'react';
import './App.less';
import icon_play from './images/icon_play.png'
import icon_sound from './images/icon_sound.png'
import icon_mute from './images/icon_mute.png'
import { Dimmer, Loader } from 'semantic-ui-react'
import superagent from 'superagent'

import * as config from '../../config.json';
import { NowEnum, INow } from '@common/now/now.common'

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
  playing: boolean;
  loading: boolean;
  trackCover?: string;
  trackTitle?: string;
  trackArtists?: string;
  trackAlbum?: string;
  auditorCount?: number;
}

class App extends React.Component<IProps, IState> {

  _isMounted: boolean = false;
  audio: HTMLAudioElement = new Audio();
  trackUrl: string = '';
  currentTrackIntervalId: number = 0;
  auditorCountIntervalId: number = 0;

  constructor(props: IProps) {
    super(props);

    this.state = {
      mute: false,
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
            let now: INow = res.body;
            let trackCover: string = now.cover ? now.cover : '';
            let trackAlbum: string = now.album ? now.album : '';
            let trackTitle: string = now.song;
            let trackArtists: string = '';
            let trackUrl: string = now.url ? now.url : '';

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

            // setState only if track has changed
            if (trackTitle !== this.state.trackTitle && trackArtists !== this.state.trackArtists) {
              this.trackUrl = trackUrl;
              this.setState({
                trackCover: trackCover,
                trackTitle: trackTitle,
                trackArtists: trackArtists,
                trackAlbum: trackAlbum,
              });
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

  render() {
    const isMobile = window.innerWidth <= 1000;
    return (
      <div className='main-container'>
        <Dimmer active={this.state.playing && this.state.loading}>
          <Loader className='unselectable'>Chargement...</Loader>
        </Dimmer>
        <div className={'title-container' + (isMobile ? '-mobile' : '') + 'unselectable'}>
          <p className={'title' + (isMobile ? '-mobile' : '')}>Radio Didou</p>
        </div>
        <div className={'player-container' + (isMobile ? '-mobile' : '')}>
          <button className={'icon-sound' + (isMobile ? '-mobile' : '')} onClick={this.onPlay}><img src={icon_play} alt=''></img></button>
          <button className={'icon-sound' + (isMobile ? '-mobile' : '')} onClick={this.onMute}><img src={this.state.mute ? icon_mute : icon_sound} alt=''></img></button>
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

export default App;
