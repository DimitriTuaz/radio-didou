
import { NowFetcher, NowEnum, NowBindings } from '../now';
import { NowInfo } from '../controllers';
import { inject } from '@loopback/core';

export class NowLive extends NowFetcher {

  public name = "Live";

  constructor(
    @inject(NowBindings.NOW_INFO) info: NowInfo
  ) {
    super();
    this.now = {
      type: NowEnum.Live,
      listeners: 0,
      song: info.song !== undefined ? info.song : 'Live',
      artists: [info.artist !== undefined ? info.artist : 'DJ'],
      album: info.album,
      url: info.url
    };
  }

  public async fetch(): Promise<void> { }

}

