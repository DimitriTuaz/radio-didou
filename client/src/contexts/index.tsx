import React from 'react'
import { MainStore} from '../stores/MainStore'
import { UserStore } from '../stores/UserStore'

export const storesContext = React.createContext({
  mainStore: new MainStore(),
  userStore: new UserStore()
})