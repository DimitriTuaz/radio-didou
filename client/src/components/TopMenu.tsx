import React from 'react';
import { Image, Menu, Icon } from 'semantic-ui-react';
import { useObserver } from 'mobx-react-lite';

import { Player, Like } from '../components'
import { UserState } from '../stores';
import { useStore } from '../hooks';

export const TopMenu = () => {

  const { mainStore, commonStore } = useStore();

  const onShowSidebar = () => {
    mainStore.showSidebar(!mainStore.sidebarVisible);
  }

  return useObserver(() => (
    < Menu color="blue" inverted compact >
      <Menu.Item >
        <Image
          size="mini"
          src={
            commonStore.userState === UserState.connected ? 'avatar128.png' :
              'logo192.png'
          } />
      </Menu.Item>
      <Menu.Item fitted >
        <Player />
      </Menu.Item>
      <Like />
      <Menu.Item as='a' onClick={onShowSidebar}>
        <Icon
          fitted
          rotated={mainStore.sidebarVisible ? 'clockwise' : undefined}
          name='bars'
          color='teal'
          size='large'>
        </Icon>
      </Menu.Item>
    </Menu>
  ));
};
