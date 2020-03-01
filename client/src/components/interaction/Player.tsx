import React, { useState, useEffect } from 'react';
import { Button, Icon } from 'semantic-ui-react';

import { Slider } from '@reach/slider'
import "@reach/slider/styles.css";

import * as config from '../../../../config.json';
const STREAM_URL: string = config.icecast + '/radio-didou';

export const Player = () => {

    const [mute, setMute] = useState(false);
    const [loading, setLoading] = useState(false);
    const [volume, setVolume] = useState(1);
    const [slider, setSlider] = useState(1);
    const [audio] = useState(new Audio());

    useEffect(() => {
        audio.onplaying = onPlaying;
    });

    const onPlaying = () => {
        setLoading(false);
    }

    const onPlay = () => {
        setLoading(true);
        audio.src = STREAM_URL;
        audio.load();
        audio.play();
    };

    const onMute = () => {
        audio.muted = !mute;
        setMute(!mute);
        setSlider(!mute ? 0 : volume);
    };

    const onChangeSlider = (slider: number) => {
        audio.volume = slider;
        setSlider(slider);
        setVolume(slider);
    };

    return (
        <Button.Group icon>
            <Button
                id='player-button'
                onClick={onPlay}>
                <Icon
                    link
                    name={loading ? 'spinner' : 'play'}
                    loading={loading}
                    color='teal' />
            </Button>
            <Button
                id='player-button'
                onClick={onMute}>
                <Icon
                    link
                    name={
                        slider >= 0.5 ? 'volume up' :
                            slider > 0 ? 'volume down' :
                                'volume off'
                    }
                    color='teal' />
            </Button>
            <Slider style={{ marginTop: 6, width: 120 }}
                value={slider}
                onChange={(slider: number) => onChangeSlider(slider)}
                min={0}
                max={1}
                step={0.05} />;
        </Button.Group>
    );
}
