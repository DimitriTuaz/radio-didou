
import {
  NowFetcher,
  NowEnum,
  NowBindings,
  NowState
} from '../now';
import { inject } from '@loopback/core';

export class NowLive extends NowFetcher {

  public name = "Live";

  constructor(
    @inject(NowBindings.NOW_STATE) state: NowState
  ) {
    super();
    this.now = {
      type: NowEnum.Live,
      listeners: 0,
      song: state.song !== undefined ? state.song : 'DJ Set Live',
      artists: [state.artist !== undefined ? state.artist : 'DJ'],
      album: state.album,
      url: state.url
    };
  }

  public async fetch(): Promise<void> { }

}
