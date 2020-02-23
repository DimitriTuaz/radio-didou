import React, { useEffect } from 'react'
import { useObserver } from 'mobx-react-lite'
import { useStores } from '../hooks/UseStores'
import { Menu, Segment, Sidebar, Icon } from 'semantic-ui-react'
import '../App.less';
import { Player, SongModal, UserModal, Now, SideMenu } from '../components'
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
    <div style={{ height: '100vh', display: 'flex', flexFlow: 'column nowrap' }}>
      <div style={{ flex: 1 }}>
        <Sidebar.Pushable as={Segment}>
          <SideMenu />
          <Sidebar.Pusher>
            <Segment basic>
              <UserModal></UserModal>
              <SongModal></SongModal>
              <div className='main-container'>
                <div className='header-container'>
                  <div className={'title-container' + (isMobile ? '-mobile' : '') + ' unselectable'}>
                    <p className={'title' + (isMobile ? '-mobile' : '')}>Radio Didou</p>
                  </div>
                  <div className={'settings-container'}>
                    <Icon
                      name='bars'
                      color='teal' // teal is the new white
                      size='big'
                      onClick={() => mainStore.showSidebar(true)} >
                    </Icon>
                  </div>
                </div>
                <Player />
                <Now />
                <div className='current-listeners-container unselectable'>
                  <p className={'current-listeners' + (isMobile ? '-mobile' : '')}>
                    {mainStore.auditorCount === undefined ? '' : mainStore.auditorCount + ' auditeur' + (mainStore.auditorCount > 1 ? 's' : '') + ' actuellement'}
                  </p>
                </div>
              </div>
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    </div>
  ));
};
