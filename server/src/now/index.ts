import { BindingKey } from '@loopback/core';
import { NowFetcher } from './now.fetcher';
import { NowService } from './now.service';
import { NowComponent } from './now.component';

export namespace NowBindings {
  export const NOW_SERVICE = BindingKey.create<NowService>('now.service');
  export const NOW_FETCHER = BindingKey.create<NowFetcher>('now.fetcher');
  export const NOW_TOKEN = BindingKey.create<string>('now.token');
  export const COMPONENT = BindingKey.create<NowComponent>('components.NowComponent');
}

export * from './now.fetcher';
export * from './now.none';
export * from './now.deezer';
export * from './now.spotify';
export * from './now.service';
