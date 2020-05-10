import ReactNativeTrackPlayer  from 'react-native-track-player';

module.exports = async function() {
    // Events handling
    ReactNativeTrackPlayer.addEventListener('remote-stop', () => {
        ReactNativeTrackPlayer.stop();
    });

    ReactNativeTrackPlayer.addEventListener('remote-play', () => {
        ReactNativeTrackPlayer.play();
    });

    ReactNativeTrackPlayer.addEventListener('remote-pause', () => {
        ReactNativeTrackPlayer.pause();
    });
}