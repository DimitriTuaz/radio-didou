import React from 'react';
import { Image, Menu, Icon } from 'semantic-ui-react';
import { useObserver } from 'mobx-react-lite';

import { Player, Like } from '..'
import { UserState } from '../../stores';
import { useStore } from '../../hooks';

export const TopMenu = () => {

  const { interfaceStore, userStore } = useStore();

  const onShowSidebar = () => {
    interfaceStore.showSidebar(!interfaceStore.activeSidebar);
  }

  return useObserver(() => (
    < Menu color="blue" inverted compact >
      <Menu.Item >
        <Image
          size="mini"
          src={
            userStore.userState === UserState.connected ? 'avatar128.png' :
              'logo192.png'
          } />
      </Menu.Item>
      <Menu.Item fitted >
        <Player />
      </Menu.Item>
      {(() => {
        if (userStore.userState === UserState.connected) {
          return <Like />
        }
      })()}
      <Menu.Item as='a' onClick={onShowSidebar}>
        <Icon
          fitted
          rotated={interfaceStore.activeSidebar ? 'clockwise' : undefined}
          name='bars'
          color='teal'
          size='large'>
        </Icon>
      </Menu.Item>
    </Menu>
  ));
};
