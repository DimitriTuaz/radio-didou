import {
  bind,
  ContextTags,
  Component,
  Binding,
  CoreTags,
  BindingScope,
  inject,
  Getter
} from '@loopback/core';

import { NowBindings, NowService, NowFetcher } from '../now';

@bind({ tags: { [ContextTags.KEY]: NowBindings.COMPONENT } })
export class NowComponent implements Component {
  bindings: Binding<unknown>[];

  constructor(
    @inject.getter(NowBindings.NOW_FETCHER) private fetcherGetter: Getter<NowFetcher>
  ) {
    this.bindings = [
      Binding.bind(NowBindings.NOW_SERVICE).toClass(NowService)
        .tag(CoreTags.LIFE_CYCLE_OBSERVER)
        .inScope(BindingScope.SINGLETON),
      Binding.bind(NowBindings.CURRENT_NOW)
        .toDynamicValue(async () => {
          let service = await serviceGetter();
          return service.value
        })
    ];
  }
}
