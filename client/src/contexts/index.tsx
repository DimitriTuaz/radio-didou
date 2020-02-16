import React from 'react'
import { MainStore} from '../stores/MainStore'
import { UserStore } from '../stores/UserStore'
import { SongStore } from '../stores/SongStore'
import { CommonStore } from '../stores/CommonStore'

const commonStore = new CommonStore();
const songStore = new SongStore();
const mainStore = new MainStore(commonStore, songStore);

export const storesContext = React.createContext({
  commonStore: commonStore,
  mainStore: mainStore,
  songStore: songStore,
  userStore: new UserStore(commonStore, mainStore, songStore),
});
