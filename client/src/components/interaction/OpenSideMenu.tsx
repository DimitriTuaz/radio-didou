import React from 'react';
import { Icon } from 'semantic-ui-react';
import { useObserver } from 'mobx-react-lite';

import { useStore } from '../../hooks';

export const OpenSideMenu = () => {

  const { interfaceStore } = useStore();

  const onShowSidebar = () => {
    interfaceStore.showSidebar(!interfaceStore.activeSidebar);
  }

  return useObserver(() => (
    <Icon
      fitted
      onClick={onShowSidebar}
      name='bars'
      color='teal'
      size='big'>
    </Icon>
  ));
};
