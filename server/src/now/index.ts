import { BindingKey } from '@loopback/core';
import { NowFetcher, NowObject } from './now.fetcher';
import { NowService } from './now.service';
import { NowComponent } from './now.component';
import { NowInfo } from '../controllers';

export namespace NowBindings {
  export const NOW_SERVICE = BindingKey.create<NowService>('now.service');
  export const CURRENT_NOW = BindingKey.create<NowObject>('now.current-now')
  export const NOW_FETCHER = BindingKey.create<NowFetcher>('now.fetcher');
  export const NOW_TOKEN = BindingKey.create<string>('now.token');
  export const NOW_INFO = BindingKey.create<NowInfo>('now.info');
  export const COMPONENT = BindingKey.create<NowComponent>('components.NowComponent');
}

export * from './now.fetcher';
export * from './now.none';
export * from './now.deezer';
export * from './now.live';
export * from './now.spotify';
export * from './now.service';
