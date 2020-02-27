import React from 'react'
import { UIStore, UserStore, SongStore, CommonStore, SettingStore } from '../stores';

const commonStore = new CommonStore();
const settingStore = new SettingStore();
const songStore = new SongStore();

const mainStore = new UIStore(commonStore, songStore);
const userStore = new UserStore(commonStore, mainStore, songStore, settingStore);

export const storesContext = React.createContext({
  commonStore: commonStore,
  mainStore: mainStore,
  songStore: songStore,
  userStore: userStore,
  settingStore: settingStore
});
