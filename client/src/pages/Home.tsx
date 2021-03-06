import React, { useEffect } from 'react'
import { Grid } from 'semantic-ui-react';
import { useObserver } from 'mobx-react-lite';
import '../App.less';

import { UserState } from '../stores';
import { useStore } from '../hooks'

import {
  Player,
  Like,
  AuditorCount,
  SideMenu,
  SocialLink,
  OpenSideMenu,
  UserModal,
  SongModal,
  CurrentTrack,
  SettingModal,
  ModalController,
  ModalKey
} from '../components';

export const Home = () => {

  const { nowStore, userStore } = useStore();

  useEffect(() => {
    nowStore.getCurrentTrack();
    nowStore.currentTrackIntervalId = window.setInterval(nowStore.getCurrentTrack, 3000);
    userStore.cookieLogin();

    return () => {
      clearInterval(nowStore.currentTrackIntervalId);
    };
  });

  return useObserver(() => (
    <>
      <SideMenu />
      <ModalController>
        {{
          [ModalKey.USER]: { element: <UserModal /> },
          [ModalKey.SONG]: { element: <SongModal />, attributes: { size: 'small' } },
          [ModalKey.SETTING]: { element: <SettingModal />, attributes: { size: 'tiny' } }
        }}
      </ModalController>
      <div id='main-container'>
        <div id='social-links-container'>
          <SocialLink url='https://soundcloud.com/radio-didou' iconName='soundcloud' />
          <SocialLink url='https://fb.me/radiodidou' iconName='facebook' />
        </div>
        <div id='open-side-menu-container'>
          <OpenSideMenu />
        </div>
        <div id={'title-container'} className={'unselectable'}>
          <p className={'title'}>Radio Didou</p>
        </div>
        <div id={'player-container'}>
          <Player />
        </div>
        <Grid columns={1} padded centered style={{ flexGrow: 1 }}>
          <Grid.Row >
            <CurrentTrack />
            {
              userStore.userState === UserState.connected &&
              <div id={'heart-container'}>
                <Like />
              </div>
            }
          </Grid.Row>
          <Grid.Row>
            <AuditorCount />
          </Grid.Row>
        </Grid>
      </div>
    </>
  ));
};
