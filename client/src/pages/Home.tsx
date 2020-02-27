import React, { useEffect } from 'react'
import { useStore } from '../hooks'
import '../App.less';

import {
  AuditorCount,
  TopMenu,
  SideMenu,
  UserModal,
  SongModal,
  CurrentTrack,
  SettingModal,
  ModalController,
  ModalKey
} from '../components';

import { Grid } from 'semantic-ui-react';

export const Home = () => {

  const { mainStore, userStore } = useStore();

  useEffect(() => {
    mainStore.getCurrentTrack();
    mainStore.currentTrackIntervalId = window.setInterval(mainStore.getCurrentTrack, 3000);
    userStore.cookieLogin();

    return () => {
      clearInterval(mainStore.currentTrackIntervalId);
    };
  });

  return (
    <div className='full-height'>
      <SideMenu />
      <ModalController>
        {{
          [ModalKey.USER]: <UserModal />,
          [ModalKey.SONG]: <SongModal />,
          [ModalKey.SETTING]: <SettingModal />
        }}
      </ModalController>
      <div id='main-container'>
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
    </div >
  );
};
