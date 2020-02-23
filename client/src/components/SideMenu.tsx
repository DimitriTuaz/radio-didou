import React from 'react';
import { useStores } from '../hooks/UseStores';
import { Menu, Sidebar, Icon } from 'semantic-ui-react';
import { UserState, SongState } from '../stores';
import { useObserver } from 'mobx-react-lite';

export const SideMenu = () => {

  const { commonStore, mainStore, songStore } = useStores();

  const onLikeListShow = async () => {
    await songStore.get();
    mainStore.showSongModal(true);
  }

  return useObserver(() => (
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
  ));
}
