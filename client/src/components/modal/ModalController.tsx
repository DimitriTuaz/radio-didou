import React from 'react'
import { Modal } from 'semantic-ui-react';

import { useStore } from '../../hooks';
import { useObserver } from 'mobx-react-lite';

export enum ModalKey {
  SETTING = 'Setting-Modal',
  SONG = 'Song-Modal',
  USER = 'User-Modal'
};

interface ElementWithAttributes {
  element: JSX.Element,
  attributes?: object
}

interface ModalControllerProps {
  children: { [key in ModalKey]: ElementWithAttributes }
}

export const ModalController = (props: ModalControllerProps) => {

  const { interfaceStore } = useStore();

  return useObserver(() => (
    <React.Fragment>
      {
        Object.entries(props.children).map(([key, value]) => {
          return (
            <Modal
              {...value.attributes}
              key={key}
              open={interfaceStore.activeModal === key}
              closeOnDimmerClick={true}
              onClose={() => { interfaceStore.showModal(key, false) }}
              closeIcon
            >
              {value.element}
            </Modal>
          );
        })
      }
    </React.Fragment>
  ));
}
