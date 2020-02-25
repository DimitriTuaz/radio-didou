import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { useObserver } from 'mobx-react-lite';

import { SongState } from '../stores';
import { useStore } from '../hooks';

export const Like = () => {

  const { mainStore, songStore } = useStore();

  const onClick = async () => {
    switch (songStore.state) {
      case SongState.liked:
        await songStore.remove(mainStore.trackUrl, mainStore.trackUrl);
        break;
      case SongState.unliked:
        await songStore.add(mainStore.trackUrl);
        break;
    }
  }

  return useObserver(() => (
    <Menu.Item as='a' onClick={onClick}>
      <Icon
        fitted
        name={songStore.state === SongState.liked ? 'heart' : 'heart outline'}
        color='teal'
        size='large'>
      </Icon>
    </Menu.Item>
  ));
};
