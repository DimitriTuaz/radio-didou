import React, {Component} from 'react';
import './App.css';
import icon_play from './images/icon_play.png'
import icon_sound from './images/icon_sound.png'
import icon_mute from './images/icon_mute.png'

var streamUrl: string = 'http://37.59.99.228:8889/radio-didou';

interface IProps {
}

interface IState {
  mute: boolean;
}

class App extends React.Component<IProps, IState> {

  audio: HTMLAudioElement = new Audio();

  constructor(props: IProps) {
    super(props);

    this.state = {
      mute: false
    };

    this.onPlay = this.onPlay.bind(this);
    this.onMute = this.onMute.bind(this);
  } 

  onPlay(): void {
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
      </div>
    );
  }
}

export default App;
