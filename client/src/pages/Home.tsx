import React, { useEffect } from 'react'
import { useStore } from '../hooks'
import '../App.less';
import { TopMenu, SideMenu, UserModal, SongModal } from '../components'

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
      <UserModal></UserModal>
      <SongModal></SongModal>
      <SideMenu />
      <div style={{ textAlign: "center" }}>
        <TopMenu />
      </div>
    </div >
  );
};
