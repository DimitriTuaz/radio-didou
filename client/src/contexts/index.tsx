import React from 'react'
import { MainStore} from '../stores/MainStore'
import { UserStore } from '../stores/UserStore'
import { SongStore } from '../stores/SongStore'

export const storesContext = React.createContext({
  mainStore: new MainStore(),
  userStore: new UserStore(),
  songStore: new SongStore()
})