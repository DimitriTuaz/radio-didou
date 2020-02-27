import React from 'react'
import { MainStore, UserStore, SongStore, CommonStore, SettingStore } from '../stores';

const commonStore = new CommonStore();
const songStore = new SongStore();
const mainStore = new MainStore(commonStore, songStore);

export const storesContext = React.createContext({
  commonStore: commonStore,
  mainStore: mainStore,
  songStore: songStore,
  userStore: new UserStore(commonStore, mainStore, songStore),
  settingStore: new SettingStore()
});
