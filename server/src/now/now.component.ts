import {
  bind,
  ContextTags,
  Component,
  Binding,
  CoreTags,
  BindingScope,
} from '@loopback/core';
import { model, property } from '@loopback/repository';

import { NowEnum } from './now.fetcher';
import { NowBindings } from './now.keys';
import { NowService } from './now.service';

@model()
export class NowObject {
  @property({ required: true, type: 'number' }) type: NowEnum;
  @property({ required: true }) listeners: number;
  @property({ required: true }) song: string;
  @property.array(String, { required: true }) artists: string[];
  @property() album?: string;
  @property() release_date?: string;
  @property() cover?: string;
  @property() url?: string;
}

@bind({ tags: { [ContextTags.KEY]: NowBindings.COMPONENT } })
export class NowComponent implements Component {
  bindings: Binding<unknown>[];

  constructor() {
    this.bindings = [
      Binding.bind(NowBindings.NOW_SERVICE)
        .toClass(NowService)
        .tag(CoreTags.LIFE_CYCLE_OBSERVER)
        .inScope(BindingScope.SINGLETON),
      Binding.bind(NowBindings.CURRENT_NOW).to(
        {
          type: NowEnum.None,
          listeners: 0,
          song: '',
          artists: []
        })
    ];
  }
}
