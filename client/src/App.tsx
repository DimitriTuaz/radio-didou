import React from 'react';
import './App.css';
import {Dimmer, Loader, Segment, Button} from 'semantic-ui-react'
import icon_play from './images/icon_play.png'
import icon_sound from './images/icon_sound.png'
import icon_mute from './images/icon_mute.png'

var streamUrl: string = 'http://37.59.99.228:8889/radio-didou';

interface IProps {
}

interface IState {
  mute: boolean;
  playing: boolean;
  loading: boolean;
}

class App extends React.Component<IProps, IState> {

  audio: HTMLAudioElement = new Audio();
  

  constructor(props: IProps) {
    super(props);

    this.state = {
      mute: false,
      playing: false,
      loading: false
    };

    this.onPlaying = this.onPlaying.bind(this);
    this.audio.onplaying = this.onPlaying;

    this.onPlay = this.onPlay.bind(this);
    this.onMute = this.onMute.bind(this);
  } 

  onPlaying(): void {
    this.setState({playing: true, loading: false});
  }

  onPlay(): void {
    this.setState({playing: true, loading: true})
    // Force reloading the stream when hitting play button
    this.audio.src = '';
    this.audio.src = streamUrl;
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
        <div className='title-container'>
            <p className='title'>Radio Didou</p>
        </div>
        <div className='player-container'>
          <button className='icon-sound' onClick={this.onPlay}><img src={icon_play} alt=''></img></button>
          <button className='icon-sound' onClick={this.onMute}><img src={this.state.mute ? icon_mute : icon_sound} alt=''></img></button>
        </div>
      <p className='text'>{(this.state.playing && this.state.loading) ? "Ça charge..." : ""}</p>
      </div>
    );
  }
}

export default App;
