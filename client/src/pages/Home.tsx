import React, { useEffect } from 'react'
import { Grid } from 'semantic-ui-react';
import '../App.less';

import { useStore } from '../hooks'

import {
  AuditorCount,
  TopMenu,
  SideMenu,
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

  return (
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
        <div id='open-side-menu-container'>
          <OpenSideMenu />
        </div>
        <div style={{ textAlign: "center" }}>
          <TopMenu />
        </div>
        <Grid columns={1} padded centered style={{ flexGrow: 1 }}>
          <Grid.Row >
            <CurrentTrack />
          </Grid.Row>
          <Grid.Row>
            <AuditorCount />
          </Grid.Row>
        </Grid>
      </div>
    </>
  );
};
