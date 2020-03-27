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
      album: 'Clique pour danser avec nous !',
      url: 'https://zoom.us/j/582964557'
    };
  }

  public async fetch(): Promise<void> { }

}
