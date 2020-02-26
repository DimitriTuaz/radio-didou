import React, { useEffect } from 'react'
import { useStore } from '../hooks'
import '../App.less';

import { AuditorCount, TopMenu, SideMenu, UserModal, SongModal, CurrentTrack } from '../components'
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
    <div>
      <SideMenu />
      <UserModal />
      <SongModal />
      <div style={{ textAlign: "center" }}>
        <TopMenu />
      </div>
      <Grid columns={1} centered padded>
        <Grid.Row>
          <CurrentTrack />
        </Grid.Row>
        <Grid.Row>
          <AuditorCount />
        </Grid.Row>
      </Grid>
    </div >
  );
};
