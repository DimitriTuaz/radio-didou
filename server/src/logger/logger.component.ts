import {
  bind,
  ContextTags,
  Component,
  Binding,
  ProviderMap,
  config
} from '@loopback/core';

import { createLogger, transports, format } from 'winston';

import {
  LoggingBindings,
  LoggerMetadataProvider,
  LoggerActionProvider,
  LoggerErrorProvider,
  LOGGER_LEVEL
} from '../logger';
import { RestBindings } from '@loopback/rest';

export type LoggingComponentConfig = {
  level: LOGGER_LEVEL,
  directory: string,
  stack_trace: boolean
};

@bind({ tags: { [ContextTags.KEY]: LoggingBindings.COMPONENT } })
export class LoggingComponent implements Component {
  providers: ProviderMap;
  bindings: Binding<unknown>[];

  constructor(
    @config() options: LoggingComponentConfig,
  ) {
    this.providers = {
      [RestBindings.SequenceActions.LOG_ERROR.key]: LoggerErrorProvider,
      [LoggingBindings.METADATA.key]: LoggerMetadataProvider,
      [LoggingBindings.LOGGER_ACTION.key]: LoggerActionProvider,
    };

    const console_format = format.printf(info =>
      `<${info.level.toUpperCase()}> : ${info.message}` +
      `${options.stack_trace && info.error ? '\n' + info.error : ''}`);

    const file_format = format.printf(info =>
      `[${info.timestamp}] - <${info.level.toUpperCase()}> : ${info.message}`);

    const error_format = format.printf(info =>
      `[${info.timestamp}]: ${info.message}\n${info.error}\n`);

    this.bindings = [
      Binding.bind(LoggingBindings.LOGGER).to(createLogger({
        transports: [
          new transports.Console({
            level: options.level,
            format: console_format
          }),
          new transports.File({
            dirname: options.directory,
            filename: 'combined.log',
            level: options.level,
            format: format.combine(
              format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
              file_format
            )
          }),
          new transports.File({
            dirname: options.directory,
            filename: 'error.log',
            level: LOGGER_LEVEL.ERROR,
            format: format.combine(
              format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
              error_format
            )
          })
        ]
      }))
    ];
  }
}
