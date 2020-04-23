import React from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity } from 'react-native';
import ReactNativeTrackPlayer from 'react-native-track-player'
import { getMetaData } from '../api/ServerAPI'

class Radio extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      isPlaying: false,
      isMuted: false,
      currentVolume: 1,
      track: '',
      artist: '',
      album: '',
      cover: '',
      listeners: 0
    };

    this._play = this._play.bind(this)
    this._mute = this._mute.bind(this)
  }

  componentDidMount() {
    this._getMetaData()
    this.timer = setInterval(()=> this._getMetaData(), 3000)
  }

  componentWillUnmount() {
    ReactNativeTrackPlayer.destroy()
  }

  _getMetaData() {
    getMetaData().then(data => {
      this.setState({
        track: data.song,
        artist: data.artists,
        album: data.album,
        artwork: data.cover,
        listeners: data.listeners
      })
    })
  }

  _play() {
    ReactNativeTrackPlayer.setupPlayer().then(async () => {
      await ReactNativeTrackPlayer.add({
          id: '',
          url: 'https://www.radio-didou.com:8895/radio-didou',
          title: '',
          artist: '',
      });
      ReactNativeTrackPlayer.play()
      this.state.isPlaying = true
    });
  }

  _mute() {
    if (!this.state.isPlaying) {
      return
    }

    if (this.state.isMuted) {
      ReactNativeTrackPlayer.setVolume(1)
      this.setState({ isMuted: false });
    } else {
      ReactNativeTrackPlayer.setVolume(0)
      this.setState({ isMuted: true });
    }
    
  }

  _displaySoundIcon() {
    let icon = require('../images/icon_sound.png')
    if (this.state.isMuted) {
      icon = require('../images/icon_mute.png')
    }
    return icon
  }

  render() {
    return (
      <ImageBackground style={styles.background} source={require('../images/background.png')}>
        <Text style={styles.title}>Radio Didou</Text>
        <TouchableOpacity style={styles.info_container}>
          <Image style={styles.artwork} source={{uri: this.state.artwork}}/>
          <View style={styles.track_info_container}>
            <Text style={styles.track_title}>{ this.state.track }</Text>
            <Text style={styles.track_info}>{ this.state.artist }</Text>
            <Text style={styles.track_info}>{ this.state.album }</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.player_container}>
          <TouchableOpacity style={styles.button_container} onPress={this._play}>
            <Image style={styles.button_image} source={require('../images/icon_play.png')}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button_container} onPress={this._mute}>
            <Image style={styles.button_image} source={this._displaySoundIcon()}/>
          </TouchableOpacity>
        </View>
        <Text style={styles.listeners_count}>{this.state.listeners} auditeurs actuellement</Text>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center'
  },
  title: {
    fontSize: 56,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 45
  },
  player_container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 240,
    width: 360,
    paddingLeft: 45
  },
  button_container: {
    flex: 1
  },
  button_image: {
    height: 160,
    width: 120,
    resizeMode: 'contain'
  },
  info_container: {
    marginTop: 60,
    padding: 25,
    height: 410,
    width: 410,
    flexDirection: 'column',
    backgroundColor: 'rgba(255, 255, 255, 0.3)'
  },
  artwork: {
    height: 240,
    width: 240,
    alignSelf: 'center',
    marginBottom: 10
  },
  track_info_container: {
    paddingLeft: 15,
    
  },
  track_title: {
    alignSelf: 'center',
    fontSize: 26,
    fontFamily: 'bold',
    color: 'white',
    marginBottom: 5
  },
  track_info: {
    alignSelf: 'center',
    fontSize: 20,
    color: 'white',
    marginBottom: 5
  },
  listeners_count: {
    alignSelf: 'center',
    fontSize: 22,
    color: 'white'
  }
});

export default Radio