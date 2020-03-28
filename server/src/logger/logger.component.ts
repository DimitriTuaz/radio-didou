import {
  BindingKey,
  bind,
  ContextTags,
  Component,
  Binding,
  ProviderMap
} from '@loopback/core';

import { createLogger, transports, format } from 'winston';

import { LoggingBindings, LoggerMetadataProvider, LoggerActionProvider } from '../logger';

@bind({ tags: { [ContextTags.KEY]: LoggingBindings.COMPONENT } })
export class LoggingComponent implements Component {
  providers: ProviderMap;
  bindings: Binding<unknown>[];

  constructor() {
    this.providers = {
      [LoggingBindings.METADATA.key]: LoggerMetadataProvider,
      [LoggingBindings.LOGGER_ACTION.key]: LoggerActionProvider,
    };

    this.bindings = [
      Binding.bind(LoggingBindings.LOGGER).to(createLogger({
        transports: [new transports.Console({})],
        level: 'info',
        format: format.combine(
          format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          format.printf(info => `<${info.level.toUpperCase()}> - [${info.timestamp}]: ${info.message}`)
        ),
        exitOnError: false
      }))
    ];
  }
}
