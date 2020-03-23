import React from 'react';
import { Icon } from 'semantic-ui-react';
import { useObserver } from 'mobx-react-lite';

import { useStore } from '../../hooks';

export const OpenSideMenu = () => {

  const { interfaceStore } = useStore();

  const onShowSidebar = () => {
    interfaceStore.showSidebar(!interfaceStore.activeSidebar);
  }

  const isMobile = window.innerWidth <= 1000;
  return useObserver(() => (
    <Icon
      fitted
      onClick={onShowSidebar}
      name='bars'
      color='teal'
      size={isMobile ? 'large' :'big'}>
    </Icon>
  ));
};
