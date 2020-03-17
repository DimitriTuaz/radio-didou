import React from 'react';
import { Image, Menu } from 'semantic-ui-react';
import { useObserver } from 'mobx-react-lite';

import { Player, Like } from '..'
import { UserState } from '../../stores';
import { useStore } from '../../hooks';

export const TopMenu = () => {

  const { userStore } = useStore();

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
    </Menu>
  ));
};
