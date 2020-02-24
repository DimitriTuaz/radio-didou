import React, { useEffect, Fragment } from 'react'
import { useObserver } from 'mobx-react-lite'
import { useStores } from '../hooks/UseStores'
import { Segment, Sidebar, Icon, Container } from 'semantic-ui-react'
import '../App.less';
import { Navigation, Player, SongModal, UserModal, Now, SideMenu } from '../components'
import { SongState, UserState } from '../stores'

export const Home = () => {

  const { mainStore, userStore } = useStores();

  useEffect(() => {
    mainStore.getCurrentTrack();
    mainStore.currentTrackIntervalId = window.setInterval(mainStore.getCurrentTrack, 3000);
    userStore.cookieLogin();

    return () => {
      clearInterval(mainStore.currentTrackIntervalId);
    };
  });


  const isMobile = window.innerWidth <= 1000;
  return useObserver(() => (
    <Fragment>
      <Navigation />
      <Container>
      </Container>
    </Fragment>
  ));
};
