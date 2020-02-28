import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { useObserver } from 'mobx-react-lite';

import { SongState } from '../../stores';
import { useStore } from '../../hooks';

export const Like = () => {

  const { nowStore, songStore } = useStore();

  const onClick = async () => {
    switch (songStore.state) {
      case SongState.liked:
        await songStore.remove(nowStore.trackUrl);
        break;
      case SongState.unliked:
        await songStore.add(nowStore.trackUrl);
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
