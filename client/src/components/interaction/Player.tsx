import React, { useState, useEffect, useContext } from 'react';
import icon_play from '../../images/icon_play.png'
import icon_sound from '../../images/icon_sound.png'
import icon_sound_low from '../../images/icon_sound_low.png'
import icon_mute from '../../images/icon_mute.png'

import "@reach/slider/styles.css";

import { Icon } from 'semantic-ui-react';
import { ConfigContext } from '../../contexts'

export const Player = () => {

    const config = useContext(ConfigContext);

    const [mute, setMute] = useState(false);
    const [loading, setLoading] = useState(false);
    const [volume, setVolume] = useState(1);
    const [audio] = useState(new Audio());

    useEffect(() => {
        audio.onplaying = onPlaying;
    });

    const onPlaying = () => {
        setLoading(false);
    }

    const onPlay = () => {
        setLoading(true);
        audio.src = config.icecast_url;
        audio.load();
        audio.play();
    };

    const onMute = () => {
        audio.muted = !mute;
        setMute(!mute);
    };

    const onChangeVolume = (event: React.FormEvent<HTMLInputElement>) => {
        audio.volume = parseFloat(event.currentTarget.value);
        setVolume(parseFloat(event.currentTarget.value))
    };

    const isMobile = window.innerWidth <= 1000;
    return (
        <React.Fragment>
            <button className={'icon-sound'} onClick={onPlay}>
                {
                    loading &&
                    <Icon
                        size='huge'
                        name='spinner'
                        loading
                        color='teal'
                    />
                }
                {
                    !loading &&
                    <img src={icon_play} alt=''></img>
                }
            </button>
            <button className={'icon-sound'} onClick={onMute}>
                <img src={mute ? icon_mute : (volume > 0.5 ? icon_sound : icon_sound_low)} alt=''></img>
            </button>
            <div style={{ display: isMobile ? 'none' : '' }} id={'volume-slider-wrapper'}>
                <input
                    min={0}
                    max={1}
                    onChange={onChangeVolume}
                    step='any'
                    type='range'
                    value={volume}
                />
            </div>
        </React.Fragment>
    );
}
