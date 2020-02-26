import React, { FunctionComponent } from 'react';
import { useObserver } from 'mobx-react-lite';
import { Item } from 'semantic-ui-react';

import { useStore } from '../hooks';

export const CurrentTrack = () => {

    const { mainStore } = useStore();

    return useObserver(() => (
        <div className='current-track-wrapper'>
            <div className='current-track-container'>
                <a onClick={() => { window.open(mainStore.trackUrl, '_blank') }}>
                    <Item.Group>
                        <Item>
                            <Item.Image
                                size='medium'
                                src={
                                    (mainStore.trackCover !== undefined
                                        && mainStore.trackCover.length > 0) ?
                                        mainStore.trackCover :
                                        'cover.png'
                                } />
                            <Item.Content verticalAlign='middle'>
                                <Item.Header>{
                                    (mainStore.trackTitle !== undefined
                                        && mainStore.trackTitle.length > 0) ?
                                        mainStore.trackTitle :
                                        'Aucun titre'
                                }</Item.Header>
                                <Item.Description>{mainStore.trackArtists}</Item.Description>
                                <Item.Extra>{mainStore.trackAlbum}</Item.Extra>
                            </Item.Content>
                        </Item>
                    </Item.Group >
                </a>
            </div>
        </div>
    ));
}
