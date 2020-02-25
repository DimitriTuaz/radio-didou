import React from 'react';
import { useStore } from '../hooks';

export const Now = () => {

    const { mainStore } = useStore();

    return (
        <div className="track-container">
            <div className="track-clickable" onClick={() => { window.open(mainStore.trackUrl, '_blank') }}>
                <div className='track-cover-container' >
                    <img className="track-cover" src={mainStore.trackCover} alt=''></img>
                </div>
                <div className="track-infos-container">
                    <p className="track-title">{mainStore.trackTitle}</p>
                    <p className="track-artists">{mainStore.trackArtists}</p>
                    <p className="track-album">{mainStore.trackAlbum}</p>
                </div>
            </div>
        </div>
    );
}
