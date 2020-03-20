import React from 'react';
import { useObserver } from 'mobx-react-lite';
import { Item } from 'semantic-ui-react';

import { useStore } from '../../hooks';

export const CurrentTrack = () => {

    const { nowStore } = useStore();

    return useObserver(() => (
        <div className='current-track-wrapper'>
            <div className='current-track-container'>
                <div
                    onClick={() => { window.open(nowStore.trackUrl, '_blank') }}>
                    <Item.Group unstackable>
                        <Item>
                            <Item.Image
                                size={window.innerWidth <= window.innerHeight ? 'small' : 'medium'}
                                src={
                                    (nowStore.trackCover !== undefined
                                        && nowStore.trackCover.length === 0) ?
                                        'cover.png' :
                                        nowStore.trackCover
                                } />
                            <Item.Content verticalAlign='middle'>
                                <Item.Header>{
                                    (nowStore.trackTitle !== undefined
                                        && nowStore.trackTitle.length === 0) ?
                                        'Radio Didou revient bientôt...' :
                                        nowStore.trackTitle
                                }</Item.Header>
                                <Item.Description>{nowStore.trackArtists}</Item.Description>
                                <Item.Extra>{nowStore.trackAlbum}</Item.Extra>
                            </Item.Content>
                        </Item>
                    </Item.Group >
                </div>
            </div>
        </div>
    ));
}
