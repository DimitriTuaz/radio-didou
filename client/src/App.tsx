import React from 'react';
import './App.less';
import icon_play from './images/icon_play.png'
import icon_sound from './images/icon_sound.png'
import icon_mute from './images/icon_mute.png'
import { Dimmer, Loader } from 'semantic-ui-react'
import superagent from 'superagent'

var SERVER_URL: string = 'http://37.59.99.228'
var ICECAST_PORT: string = ':8889'
var NODE_PORT: string = ':8888'
var STREAM_URL: string = SERVER_URL + ICECAST_PORT + '/radio-didou';
var ICECAST_STATUS_URL: string = SERVER_URL + ICECAST_PORT + '/status-json.xsl';
//var CURRENT_TRACK_URL: string = SERVER_URL + NODE_PORT + '/now';
var CURRENT_TRACK_URL: string = "http://192.168.43.228" + NODE_PORT + '/now';

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

  audio: HTMLAudioElement = new Audio();
  trackUrl: string = '';
  
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
    this.audio.onplaying = this.onPlaying;

    this.getCurrentTrack = this.getCurrentTrack.bind(this);
    this.getAuditorCount = this.getAuditorCount.bind(this);
    this.getCurrentTrack();
    this.getAuditorCount();
    setInterval(this.getCurrentTrack, 10000)
    setInterval(this.getAuditorCount, 1000)

    this.onPlay = this.onPlay.bind(this);
    this.onMute = this.onMute.bind(this);
  } 

  getCurrentTrack() {
    superagent
      .get(CURRENT_TRACK_URL)
      .set('Accept', 'application/json')
      .then(
        res => {
          if (res.status && res.status === 200) {
            if (res.body.item !== undefined) {
              var album:string = res.body.item.album.name + " (" + res.body.item.album.release_date.substring(0, 4) + ")";
              var artists:string = "";
              res.body.item.artists.forEach((item:any , index: number) => {
                artists += item.name;
                if (index < res.body.item.artists.length - 1) {
                  artists += ", ";
                }
              })
              this.trackUrl = res.body.item.external_urls.spotify;
              this.setState({
                trackCover: res.body.item.album.images[1].url,
                trackTitle: res.body.item.name,
                trackArtists: artists,
                trackAlbum: album
              })
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
          if (res.status && res.status === 200) {
            if (res.body.icestats !== undefined && res.body.icestats.source[0] !== undefined) {
              this.setState({auditorCount: res.body.icestats.source[0].listeners})
            }
            else if (res.body.icestats !== undefined && res.body.icestats.source !== undefined) {
              this.setState({auditorCount: res.body.icestats.source.listeners})
            }
            else {
              this.setState({auditorCount: undefined})
            }
          }
        }
      )
  }

  onPlaying(): void {
    this.setState({playing: true, loading: false});
  }

  onPlay(): void {
    this.setState({playing: true, loading: true})
    // Force reloading the stream when hitting play button
    this.audio.src = '';
    this.audio.src = STREAM_URL;
    this.audio.load();
    this.audio.play();
  }

  onMute(): void {
    this.audio.muted = !this.state.mute;
    this.setState({mute: !this.state.mute});
  }

  render() {
    return (
      <div className='main-container'>
        <Dimmer active={this.state.playing && this.state.loading}>
          <Loader className='unselectable'>Chargement...</Loader>
        </Dimmer>
        <div className='title-container unselectable'>
            <p className='title'>Radio Didou</p>
        </div>
        <div className='player-container'>
            <button className='icon-sound' onClick={this.onPlay}><img src={icon_play} alt=''></img></button>  
          <button className='icon-sound' onClick={this.onMute}><img src={this.state.mute ? icon_mute : icon_sound} alt=''></img></button>
        </div>

        <div className='track-container' onClick={() => {window.open(this.trackUrl, '_blank')}}>
          <div className='track-cover-container' >
              <img className='track-cover' src={this.state.trackCover} alt=''></img>
          </div>
          <div className="track-infos-container">
              <p className="track-title">{this.state.trackTitle}</p>
              <p className="track-artists">{this.state.trackArtists}</p>
              <p className="track-album">{this.state.trackAlbum}</p>
          </div>
        </div>

        <div className='auditor-container unselectable'>
          <p className='text'>
            {this.state.auditorCount === undefined ? '' : this.state.auditorCount + ' auditeur' + (this.state.auditorCount > 1 ? 's' : '')+' actuellement'}
          </p>
        </div>
      </div>
    );
  }
}

export default App;
