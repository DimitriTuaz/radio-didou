import { inject, Setter } from '@loopback/core';

import { NowBindings } from './now.keys';
import { NowObject } from './now.component';
import { NowFetcher, NowEnum } from './now.fetcher';


export class NowNone extends NowFetcher {

  public name = "None";

  constructor(
    @inject(NowBindings.CURRENT_NOW) now: NowObject,
    @inject.setter(NowBindings.CURRENT_NOW) private nowSetter: Setter<NowObject>
  ) {
    super();
    this.nowSetter({
      type: NowEnum.None,
      listeners: now.listeners,
      song: 'Radio Didou revient bientôt...',
      artists: [],
    });
  }

  public async fetch(): Promise<void> { }
}
