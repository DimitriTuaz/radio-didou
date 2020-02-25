import React from 'react';
import { Menu, Sidebar, Icon } from 'semantic-ui-react';
import { useObserver } from 'mobx-react-lite';

import { UserState } from '../stores';
import { useStore } from '../hooks';

export const SideMenu = () => {

  const { commonStore, mainStore, songStore } = useStore();

  const onClickLike = async () => {
    await songStore.get();
    mainStore.showSongModal(true);
  }

  const onClickUser = () => {
    if (commonStore.userState === UserState.signup) {
      commonStore.userState = UserState.login;
    }
    mainStore.showLoginModal(true);
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
      color='blue'>

      <Menu.Item as='a' onClick={() => mainStore.showSidebar(false)}>
        <Icon name='angle right' />
      </Menu.Item>

      <Menu.Item as='a' onClick={onClickUser}>
        <Icon name='user' />
      </Menu.Item>

      {(() => {
        if (commonStore.userState === UserState.connected)
          return (
            <Menu.Item as='a' onClick={onClickLike}>
              <Icon name='heart' />
            </Menu.Item>
          );
      })()}

      <Menu.Item as='a'
        onClick={() => {
          window.open(window.location.origin + '/jingles', '_blank')
        }}>
        <Icon name='announcement' />
      </Menu.Item>

      <Menu.Item as='a' onClick={() => {
        window.open('https://ign.radio-didou.com')
      }}>
        <Icon name='compass' />
      </Menu.Item>

    </Sidebar>
  ));
}
