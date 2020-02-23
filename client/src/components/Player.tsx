import React, { useState, useEffect } from 'react';
import { Button, Icon } from 'semantic-ui-react';

import * as config from '../../../config.json';
const STREAM_URL: string = config.icecast + '/radio-didou';

export const Player = () => {

    const [mute, setMute] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [loading, setLoading] = useState(false);
    const [volume, setVolume] = useState(1);
    const [audio] = useState(new Audio());

    useEffect(() => {
        audio.onplaying = onPlaying;
    });

    const onPlaying = () => {
        setPlaying(true);
        setLoading(false);
    }

    const onPlay = () => {
        setPlaying(true);
        setLoading(true);
        audio.src = '';
        audio.src = STREAM_URL;
        audio.load();
        audio.play();
    };

    const onMute = () => {
        audio.muted = !mute;
        setMute(!mute)
    };

    const onChangeVolume = (event: React.FormEvent<HTMLInputElement>) => {
        audio.volume = parseFloat(event.currentTarget.value);
        setVolume(parseFloat(event.currentTarget.value))
    };

    return (
        <Button.Group icon>
            <Button>
                <Icon name='play' />
            </Button>
            <Button>
                <Icon name='pause' />
            </Button>
            <Button>
                <Icon name='shuffle' />
            </Button>
        </Button.Group>
    );
}

/*

        <div className="player-container">
            <button className={'icon-sound' + (isMobile ? '-mobile' : '')} onClick={onPlay}>
                <img src={icon_play} alt=''></img>
            </button>
            <button className={'icon-sound' + (isMobile ? '-mobile' : '')} onClick={onMute}>
                <img src={mute ? icon_mute : (volume > 0.5 ? icon_sound : icon_sound_low)} alt=''></img>
            </button>
            <div style={{ display: isMobile ? 'none' : '' }} className={'volume-slider-wrapper' + (isMobile ? '-mobile' : '')}>
                <input
                    min={0}
                    max={1}
                    onChange={onChangeVolume}
                    step='any'
                    type='range'
                    value={volume}
                />
            </div>
        </div>
        */

        /*
                      <Dimmer active={playing && loading}>
                <Loader className='unselectable'>Chargement...</Loader>
              </Dimmer>
              */