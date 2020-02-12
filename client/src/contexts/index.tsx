import React from 'react'
import { MainStore} from '../stores/MainStore'
import { UserStore } from '../stores/UserStore'
import { SongStore } from '../stores/SongStore'
import { CommonStore } from '../stores/CommonStore'

const commonStore = new CommonStore();

export const storesContext = React.createContext({
  commonStore: commonStore,
  mainStore: new MainStore(commonStore),
  userStore: new UserStore(commonStore),
  songStore: new SongStore()
});
