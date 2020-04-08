import { BindingKey } from '@loopback/core';

import { NowComponent, NowObject } from './now.component';
import { NowService, NowState } from './now.service';
import { NowFetcher } from './now.fetcher';


export namespace NowBindings {
  export const COMPONENT = BindingKey.create<NowComponent>('components.NowComponent');
  export const NOW_SERVICE = BindingKey.create<NowService>('now.service');
  export const NOW_STATE = BindingKey.create<NowState>('now.state');
  export const NOW_FETCHER = BindingKey.create<NowFetcher>('now.fetcher');
  export const NOW_TOKEN = BindingKey.create<string>('now.token');
  export const CURRENT_NOW = BindingKey.create<NowObject>('now.current-now');
}
