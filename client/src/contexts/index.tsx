import React from 'react'
import { MainStore, UserStore, SongStore, CommonStore, SettingStore } from '../stores';

const commonStore = new CommonStore();
const settingStore = new SettingStore();
const songStore = new SongStore();

const mainStore = new MainStore(commonStore, songStore);
const userStore = new UserStore(commonStore, mainStore, songStore, settingStore);

export const storesContext = React.createContext({
  commonStore: commonStore,
  mainStore: mainStore,
  songStore: songStore,
  userStore: userStore,
  settingStore: settingStore
});
