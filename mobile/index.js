import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('RadioDidou', () => App);

TrackPlayer.registerPlaybackService(() => require('./service.js'));