import { NowFetcher, NowEnum } from '.';

export class NowLive extends NowFetcher {

  public name = "Live";

  constructor() {
    super();
    this.now = {
      type: NowEnum.Live,
      listeners: 0,
      song: 'Coronight',
      artists: ['DJ Didou playing live'],
      album: 'Clique pour nous rejoindre!',
      url: 'https://zoom.us/j/874497778'
    };
  }

  public async fetch(): Promise<void> { }

}
