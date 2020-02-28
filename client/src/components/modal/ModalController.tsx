import React from 'react'
import { Modal } from 'semantic-ui-react';

import { useStore } from '../../hooks';
import { useObserver } from 'mobx-react-lite';

export enum ModalKey {
  SETTING = 'Setting-Modal',
  SONG = 'Song-Modal',
  USER = 'User-Modal'
};

interface ModalControllerProps {
  children: { [key in ModalKey]?: JSX.Element }
}

export const ModalController = (props: ModalControllerProps) => {

  const { interfaceStore } = useStore();

  return useObserver(() => (
    <React.Fragment>
      {
        Object.entries(props.children).map(([key, element]) => {
          return (
            <Modal
              open={interfaceStore.activeModal === key}
              closeOnDimmerClick={true}
              onClose={() => { interfaceStore.showModal(key, false) }}
              closeIcon>
              {element}
            </Modal>
          );
        })
      }
    </React.Fragment>
  ));
}
