
import { inject, Setter } from '@loopback/core';

import { NowBindings } from './now.keys';
import { NowObject } from './now.component';
import { NowFetcher, NowEnum } from './now.fetcher';
import { NowState } from './now.service';

export class NowLive extends NowFetcher {

  public name = "Live";

  constructor(
    @inject(NowBindings.NOW_STATE) state: NowState,
    @inject(NowBindings.CURRENT_NOW) now: NowObject,
    @inject.setter(NowBindings.CURRENT_NOW) private nowSetter: Setter<NowObject>
  ) {
    super();
    this.nowSetter({
      type: NowEnum.Live,
      listeners: now.listeners,
      song: state.song !== undefined ? state.song : 'DJ Set Live',
      artists: [state.artist !== undefined ? state.artist : 'DJ'],
      album: state.album !== undefined ? state.album : 'Direct LIVE',
      url: state.url
    });
  }

  public async fetch(): Promise<void> { }
}
