import React from 'react';
import { useObserver } from 'mobx-react-lite';
import { Item } from 'semantic-ui-react';

import { useStore } from '../../hooks';

export const CurrentTrack = () => {

    const { nowStore } = useStore();

    return useObserver(() => (
        <div className='current-track-wrapper'>
            <div className='current-track-container'>
                <a
                    href={nowStore.trackUrl}
                    onClick={() => { window.open(nowStore.trackUrl, '_blank') }}>
                    <Item.Group>
                        <Item>
                            <Item.Image
                                size='medium'
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
                                        'Aucun titre' :
                                        nowStore.trackTitle
                                }</Item.Header>
                                <Item.Description>{nowStore.trackArtists}</Item.Description>
                                <Item.Extra>{nowStore.trackAlbum}</Item.Extra>
                            </Item.Content>
                        </Item>
                    </Item.Group >
                </a>
            </div>
        </div>
    ));
}