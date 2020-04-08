import { BindingKey } from '@loopback/core';
import { NowFetcher, NowObject } from './now.fetcher';
import { NowService, NowState } from './now.service';
import { NowComponent } from './now.component';

export namespace NowBindings {
  export const NOW_SERVICE = BindingKey.create<NowService>('now.service');
  export const CURRENT_NOW = BindingKey.create<NowObject>('now.current-now')
  export const NOW_FETCHER = BindingKey.create<NowFetcher>('now.fetcher');
  export const NOW_TOKEN = BindingKey.create<string>('now.token');
  export const NOW_STATE = BindingKey.create<NowState>('now.state');
  export const COMPONENT = BindingKey.create<NowComponent>('components.NowComponent');
}
