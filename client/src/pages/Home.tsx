import React, { useEffect } from 'react'
import { useObserver } from 'mobx-react-lite'
import { useStores } from '../hooks/UseStores'
import { Menu, Segment, Sidebar, Icon } from 'semantic-ui-react'
import '../App.less';
import { Player, SongModal, UserModal, Now } from '../components'
import { SongState, UserState } from '../stores'

export const Home = () => {

  const { commonStore, mainStore, userStore, songStore } = useStores();

  useEffect(() => {
    mainStore.getCurrentTrack();
    mainStore.currentTrackIntervalId = window.setInterval(mainStore.getCurrentTrack, 3000);
    userStore.cookieLogin();

    return () => {
      clearInterval(mainStore.currentTrackIntervalId);
    };
  });

  const onLike = async () => {
    switch (songStore.state) {
      case SongState.liked:
        await songStore.remove(mainStore.trackUrl, mainStore.trackUrl);
        break;
      case SongState.unliked:
        await songStore.add(mainStore.trackUrl);
        break;
    }
  }

  const onLikeListShow = async () => {
    await songStore.get();
    mainStore.showSongModal(true);
  }


  const isMobile = window.innerWidth <= 1000;
  return useObserver(() => (
    <div style={{ height: '100vh', display: 'flex', flexFlow: 'column nowrap' }}>
      <div style={{ flex: 1 }}>
        <Sidebar.Pushable as={Segment}>
          <Sidebar
            as={Menu}
            animation='overlay'
            icon='labeled'
            direction='right'
            inverted
            vertical
            visible={mainStore.sidebarVisible}
            width='thin'
            color='blue'
          >
            <Menu.Item as='a' onClick={() => mainStore.showSidebar(false)}>
              <Icon name='angle right' />
            </Menu.Item>
            <Menu.Item as='a' onClick={() => {
              if (commonStore.userState === UserState.signup) {
                commonStore.userState = UserState.login;
              }
              mainStore.showLoginModal(true);
            }}>
              <Icon name='user' />
            </Menu.Item>
            {
              commonStore.userState === UserState.connected &&
              <Menu.Item as='a' onClick={() => onLikeListShow()}>
                <Icon name='heart' />
              </Menu.Item>
            }
            <Menu.Item as='a' onClick={() => { window.open(window.location.origin + '/jingles', '_blank') }}>
              <Icon name='announcement' />
            </Menu.Item>
            <Menu.Item as='a' onClick={() => { window.open('https://ign.radio-didou.com') }}>
              <Icon name='compass' />
            </Menu.Item>
          </Sidebar>
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
  ))
};
