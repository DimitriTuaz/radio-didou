import { inject, Setter, Getter } from '@loopback/core';

import { NowBindings } from './now.keys';
import { NowObject } from './now.component';
import { NowFetcher, NowEnum } from './now.fetcher';


export class NowNone extends NowFetcher {

  public name = "None";

  constructor(
    @inject.getter(NowBindings.CURRENT_NOW) private nowGetter: Getter<NowObject>,
    @inject.setter(NowBindings.CURRENT_NOW) private nowSetter: Setter<NowObject>
  ) {
    super();
  }

  public async fetch(): Promise<void> {
    let now: NowObject = await this.nowGetter();
    this.nowSetter({
      type: NowEnum.None,
      listeners: now.listeners,
      song: 'Radio Didou revient bientôt...',
      artists: [],
    });
  }
}
