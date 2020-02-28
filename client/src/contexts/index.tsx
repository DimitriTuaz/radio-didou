import React from 'react'
import { NowStore, UIStore, UserStore, SongStore, SettingStore } from '../stores';

export class RootStore {
  public readonly nowStore: NowStore;
  public readonly interfaceStore: UIStore;
  public readonly userStore: UserStore;
  public readonly songStore: SongStore;
  public readonly settingStore: SettingStore;

  constructor() {
    this.nowStore = new NowStore(this);
    this.interfaceStore = new UIStore();
    this.userStore = new UserStore(this);
    this.songStore = new SongStore();
    this.settingStore = new SettingStore();
  }
}

const rootStore = new RootStore();

export const storesContext = React.createContext({
  nowStore: rootStore.nowStore,
  interfaceStore: rootStore.interfaceStore,
  userStore: rootStore.userStore,
  songStore: rootStore.songStore,
  settingStore: rootStore.settingStore
});
