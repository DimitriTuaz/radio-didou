import {
  bind,
  ContextTags,
  Component,
  Binding,
  ProviderMap,
  config
} from '@loopback/core';

import { createLogger, LoggerOptions } from 'winston';

import { LoggingBindings, LoggerMetadataProvider, LoggerActionProvider } from '../logger';

@bind({ tags: { [ContextTags.KEY]: LoggingBindings.COMPONENT } })
export class LoggingComponent implements Component {
  providers: ProviderMap;
  bindings: Binding<unknown>[];

  constructor(
    @config() private options: LoggerOptions = {},
  ) {
    this.providers = {
      [LoggingBindings.METADATA.key]: LoggerMetadataProvider,
      [LoggingBindings.LOGGER_ACTION.key]: LoggerActionProvider,
    };

    this.bindings = [
      Binding.bind(LoggingBindings.LOGGER).to(createLogger({
        ...this.options
      }))
    ];
  }
}
