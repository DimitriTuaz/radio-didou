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
  Soundcloud,
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
          [ModalKey.USER]: <UserModal />,
          [ModalKey.SONG]: <SongModal />,
          [ModalKey.SETTING]: <SettingModal />
        }}
      </ModalController>
      <div id='main-container'>
        <div id='soundlcoud-container'>
          <Soundcloud />
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
