import React from 'react';
import { Container, Image, Menu } from 'semantic-ui-react';
import { Player } from '../components';
export const Navigation = () => (
  <Menu color="blue" inverted>
    <Menu.Item >
      <Image
        size="mini"
        src="logo192.png"
      />
    </Menu.Item>
    <Menu.Item fitted >
      <Player />
    </Menu.Item>
    <Menu.Menu position="right">
      <Menu.Item as="a" name="login">
        Login
        </Menu.Item>
      <Menu.Item as="a" name="register">
        Register
        </Menu.Item>
    </Menu.Menu>
  </Menu >
);
