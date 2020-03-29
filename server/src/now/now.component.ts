import {
  bind,
  ContextTags,
  Component,
  Binding,
  CoreTags,
  BindingScope
} from '@loopback/core';

import { NowBindings, NowService } from '../now';

@bind({ tags: { [ContextTags.KEY]: NowBindings.COMPONENT } })
export class NowComponent implements Component {
  bindings: Binding<unknown>[];

  constructor(
  ) {
    this.bindings = [
      Binding.bind(NowBindings.NOW_SERVICE)
        .toClass(NowService)
        .tag(CoreTags.LIFE_CYCLE_OBSERVER)
        .inScope(BindingScope.SINGLETON)
    ];
  }
}
