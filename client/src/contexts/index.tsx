import React from 'react'
import { NowStore, UIStore, UserStore, SongStore, SettingStore } from '../stores';

const userStore = new UserStore();

const interfaceStore = new UIStore();
const songStore = new SongStore();
const settingStore = new SettingStore();

const nowStore = new NowStore(userStore, songStore);

export const storesContext = React.createContext({
  nowStore: nowStore,
  interfaceStore: interfaceStore,
  userStore: userStore,
  songStore: songStore,
  settingStore: settingStore
});
