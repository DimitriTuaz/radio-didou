import { NowFetcher, NowEnum } from '.';

export class NowLive extends NowFetcher {

  public name = "Live";

  constructor() {
    super();
    this.now = {
      type: NowEnum.Live,
      listeners: 0,
      song: 'Coronight III - La Revanche de la Cigale',
      artists: ['DJ Didou playing live'],
      album: 'Clique pour danser avec nous !',
      url: 'https://zoom.us/j/206002178'
    };
  }

  public async fetch(): Promise<void> { }

}
