import React from 'react';
import { Icon } from 'semantic-ui-react';

export const Soundcloud = () => {
  return (
    <Icon
      fitted
      onClick={() => {window.open('https://soundcloud.com/radio-didou', '_blank')}}
      name='soundcloud'
      color='teal'
      size='big'>
    </Icon>
  );
};
