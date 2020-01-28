import { NowFetcher } from '../now';
import { NowEnum } from '@common/now/now.common';

export class NowNone extends NowFetcher {

  public name = "None";

  constructor() {
    super();
    this.now = {
      type: NowEnum.None,
      listeners: 0,
      song: '',
      artists: [],
    };
  }

  public async fetch(): Promise<void> { }

}
