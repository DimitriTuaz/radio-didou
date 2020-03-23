import React from 'react';
import { Icon } from 'semantic-ui-react';
import { ALL_ICONS_IN_ALL_CONTEXTS } from 'semantic-ui-react/dist/commonjs/lib/SUI';

interface SocialLinkProps {
  url: string,
  iconName?: string
}

export const SocialLink = (props: SocialLinkProps) => {
  let icon: string = 'facebook';
  if (props.iconName && ALL_ICONS_IN_ALL_CONTEXTS.indexOf(props.iconName.toLowerCase()) > -1) {
    icon = props.iconName;
  }

  const isMobile = window.innerWidth <= 1000;
  return ( 
    <div id='social-link-container'>
      <Icon
        fitted
        onClick={() => {window.open(props.url, '_blank')}}
        className={icon}
        color='teal'
        size={isMobile ? 'large' :'big'}>
      </Icon>
    </div>
  );
};
