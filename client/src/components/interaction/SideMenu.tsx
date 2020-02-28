import React from 'react';
import { Menu, Sidebar, Icon } from 'semantic-ui-react';
import { useObserver } from 'mobx-react-lite';

import { UserState } from '../../stores';
import { useStore } from '../../hooks';
import { ModalKey } from '../../components';

export const SideMenu = () => {

  const { userStore, interfaceStore, songStore } = useStore();

  const onClickLike = async () => {
    await songStore.get();
    interfaceStore.showModal(ModalKey.SONG, true)
  }

  const onClickUser = () => {
    if (userStore.userState === UserState.signup) {
      userStore.userState = UserState.login;
    }
    interfaceStore.showModal(ModalKey.USER, true)
  }

  const onClickSettings = () => {
    interfaceStore.showModal(ModalKey.SETTING, true)
  }

  return useObserver(() => (
    <Sidebar
      as={Menu}
      animation='overlay'
      icon='labeled'
      direction='right'
      inverted
      vertical
      visible={interfaceStore.activeSidebar}
      width='thin'
      color='blue'>

      <Menu.Item as='a' onClick={() => interfaceStore.showSidebar(false)}>
        <Icon name='angle right' />
      </Menu.Item>

      <Menu.Item as='a' onClick={onClickUser}>
        <Icon name='user' />
      </Menu.Item>

      {(() => {
        if (userStore.userState === UserState.connected)
          return (
            <Menu.Item as='a' onClick={onClickLike}>
              <Icon name='heart' />
            </Menu.Item>
          );
      })()}

      {(() => {
        if (userStore.userState === UserState.connected)
          return (
            <Menu.Item as='a' onClick={onClickSettings}>
              <Icon name='cog' />
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
