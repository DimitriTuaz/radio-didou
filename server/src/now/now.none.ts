import { NowFetcher, NowEnum } from '../now';

export class NowNone extends NowFetcher {

  public name = "None";

  constructor() {
    super();
    this.now = {
      type: NowEnum.None,
      listeners: 0,
      song: 'Radio Didou revient bientôt...',
      artists: [],
    };
  }

  public async fetch(): Promise<void> { }

}
