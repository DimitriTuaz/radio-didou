import React from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity } from 'react-native';

class Radio extends React.Component {
  render() {
      return (
        <ImageBackground style={styles.background} source={require('../images/background.png')}>
          <Text style={styles.title}>Radio Didou</Text>
          <View style={styles.player_container}>
            <TouchableOpacity style={styles.button_container}>
              <Image style={styles.play_button_image} source={require('../images/icon_play.png')}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button_container}>
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