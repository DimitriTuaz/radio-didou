
import { inject, Setter, Getter } from '@loopback/core';

import { NowBindings } from './now.keys';
import { NowObject } from './now.component';
import { NowFetcher, NowEnum } from './now.fetcher';
import { NowState } from './now.service';

export class NowLive extends NowFetcher {

  public name = "Live";

  constructor(
    @inject(NowBindings.NOW_STATE) private state: NowState,
    @inject.getter(NowBindings.CURRENT_NOW) private nowGetter: Getter<NowObject>,
    @inject.setter(NowBindings.CURRENT_NOW) private nowSetter: Setter<NowObject>
  ) {
    super();
  }

  public async fetch(): Promise<void> {
    let now: NowObject = await this.nowGetter();
    this.nowSetter({
      type: NowEnum.Live,
      listeners: now.listeners,
      song: this.state.song !== undefined ? this.state.song : 'DJ Set Live',
      artists: [this.state.artist !== undefined ? this.state.artist : 'DJ'],
      album: this.state.album !== undefined ? this.state.album : 'Direct LIVE',
      url: this.state.url
    });
  }
}
