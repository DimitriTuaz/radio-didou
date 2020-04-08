import React from 'react';
import { useObserver } from 'mobx-react-lite';
import { Item } from 'semantic-ui-react';

import { useStore } from '../../hooks';
import { NowEnum } from '../../stores';

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
                                src={(() => {
                                    if (nowStore.trackCover !== undefined && nowStore.trackCover.length > 0)
                                        return nowStore.trackCover;
                                    else if (nowStore.trackType !== undefined) {
                                        switch (nowStore.trackType) {
                                            case NowEnum.Live:
                                                return 'live-alt.png';
                                            default:
                                                return 'none.png'
                                        }
                                    }
                                })()
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
