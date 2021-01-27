import React from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity, Linking } from 'react-native';
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
      artists: [],
      album: '',
      cover: '',
      url: '',
      listeners: 0
    };

    this._play = this._play.bind(this)
    this._mute = this._mute.bind(this)
    this._displayArtists = this._displayArtists.bind(this)
    this._openSpotify = this._openSpotify.bind(this)
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
        artists: data.artists,
        album: data.album,
        artwork: data.cover,
        url: data.url,
        listeners: data.listeners
      })
    })
  }

  _play() {
    ReactNativeTrackPlayer.setupPlayer().then(async () => {
      
      ReactNativeTrackPlayer.updateOptions({
          // Whether the player should stop running when the app is closed on Android
          stopWithApp: false,
          alwaysPauseOnInterruption: false,
          capabilities: [
            ReactNativeTrackPlayer.CAPABILITY_PLAY,
            ReactNativeTrackPlayer.CAPABILITY_PAUSE,
            ReactNativeTrackPlayer.CAPABILITY_STOP
          ],

          // Capabilities of the deployed notification on Android
          notificationCapabilities: [
            ReactNativeTrackPlayer.CAPABILITY_PLAY,
            ReactNativeTrackPlayer.CAPABILITY_PAUSE,
            ReactNativeTrackPlayer.CAPABILITY_STOP
          ],
          
          // Capabilities of the compact notification on Android
          compactCapabilities: [
            ReactNativeTrackPlayer.CAPABILITY_PLAY,
            ReactNativeTrackPlayer.CAPABILITY_PAUSE,
            ReactNativeTrackPlayer.CAPABILITY_STOP
          ],

          // Notification icon
          icon: require('../images/logo-bw.png')
      });

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

  _displayArtists() {
    if (this.state.artists.length === 1) {
        return this.state.artists
    } else if (this.state.artists.length > 1) {
      let artistsList = '';
      for (var i = 0; i < this.state.artists.length; i++) {
        artistsList.concat(', ', this.state.artists[i])
      }
      return artistsList
    } else {
      return 'Unknown Artist'
    }
  }

  _openSpotify() {
    Linking.openURL(this.state.url);
  }

  render() {
    return (
      <ImageBackground style={styles.background} source={require('../images/background.png')}>
        <View style={styles.title_container}>
          <Text style={styles.title}>Radio Didou</Text>
        </View>
        
        <TouchableOpacity style={styles.info_container} onPress={this._openSpotify}>
          <Image style={styles.artwork} source={{uri: this.state.artwork}}/>
            <View style={styles.track_info_container}>
              <Text style={styles.track_title}>{ this.state.track }</Text>
              <Text style={styles.track_info}>{ this._displayArtists() }</Text>
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

        <View style={styles.listeners_container}>
          <Text style={styles.listeners_count}>{this.state.listeners} auditeurs actuellement</Text>
        </View>

      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({

  // -- Background --

  background: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },

  // -- Title --

  title_container: {
    flex: 12,
    justifyContent: 'center',
    margin: 10
  },
  title: {
    fontSize: 54,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white'
  },

  // -- Track Info --

  info_container: {
    flex: 70,
    justifyContent: 'center',
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  artwork: {
    width: '86%',
    height: '70%',
    resizeMode: 'contain',
    alignSelf: 'center'
  },
  track_info_container: {
    flex: 0
  },
  track_title: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'bold',
    color: 'white',
    marginBottom: 5
  },
  track_info: {
    alignSelf: 'center',
    fontSize: 20,
    color: 'white',
    marginBottom: 5,
    textAlign: 'center',
  },

  // -- Player --

  player_container: {
    flex: 22,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  button_container: {
    marginTop: '5%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  button_image: {
    height: '90%',
    width: '90%',
    resizeMode: 'contain'
  },

  // -- Listeners --

  listeners_container: {
    flex: 12,
    width: '100%',
    justifyContent: 'center'
  },
  listeners_count: {
    alignSelf: 'center',
    fontSize: 22,
    color: 'white'
  }
});

export default Radio