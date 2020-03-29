import {
  bind,
  ContextTags,
  Component,
  Binding,
  ProviderMap,
  config
} from '@loopback/core';

import { createLogger, LoggerOptions } from 'winston';

import {
  LoggingBindings,
  LoggerMetadataProvider,
  LoggerActionProvider,
  LoggerErrorProvider
} from '../logger';
import { RestBindings } from '@loopback/rest';

@bind({ tags: { [ContextTags.KEY]: LoggingBindings.COMPONENT } })
export class LoggingComponent implements Component {
  providers: ProviderMap;
  bindings: Binding<unknown>[];

  constructor(
    @config({ fromBinding: LoggingBindings.LOGGER }) private loggerOptions: LoggerOptions = {},
  ) {
    this.providers = {
      [RestBindings.SequenceActions.LOG_ERROR.key]: LoggerErrorProvider,
      [LoggingBindings.METADATA.key]: LoggerMetadataProvider,
      [LoggingBindings.LOGGER_ACTION.key]: LoggerActionProvider,
    };

    this.bindings = [
      Binding.bind(LoggingBindings.LOGGER).to(createLogger({
        ...this.loggerOptions
      }))
    ];
  }
}
