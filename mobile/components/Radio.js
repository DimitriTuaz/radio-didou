import React from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity } from 'react-native';
import ReactNativeTrackPlayer from 'react-native-track-player'

class Radio extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      isPlaying: false,
      isMuted: false,
      currentVolume: 1
    };

    this._play = this._play.bind(this)
    this._mute = this._mute.bind(this)
  }

  componentWillUnmount() {
    console.log("componentWillUnmount")
    ReactNativeTrackPlayer.destroy()
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
      this.state.isMuted = false
    } else {
      ReactNativeTrackPlayer.setVolume(0)
      this.state.isMuted = true
    }
    
  }

  render() {
    return (
      <ImageBackground style={styles.background} source={require('../images/background.png')}>
        <Text style={styles.title}>Radio Didou</Text>
        <View style={styles.player_container}>
          <TouchableOpacity style={styles.button_container} onPress={this._play}>
            <Image style={styles.play_button_image} source={require('../images/icon_play.png')}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button_container} onPress={this._mute}>
            <Image style={styles.mute_button_image} source={require('../images/icon_mute.png')}/>
          </TouchableOpacity>
        </View>
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
    marginTop: 55
  },
  player_container: {
    flexDirection: 'row',
    height: 120,
    width: 200,
    marginTop: 40
  },
  button_container: {
    alignItems: 'center'
  },
  play_button_image: {
    height: 120,
    width: 80,
    resizeMode: 'contain',
    padding: 55
  },
  mute_button_image: {
    height: 120,
    width: 80,
    resizeMode: 'contain',
    padding: 55
  }
});

export default Radio