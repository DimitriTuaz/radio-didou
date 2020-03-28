import { BindingKey } from '@loopback/core'
import { Logger } from 'winston'
import { LoggerMetadata } from './logger.decorator'
import { LoggingComponent } from './logger.component'
import { OperationArgs, Request } from '@loopback/rest'

export namespace LoggingBindings {
  export const LOGGER = BindingKey.create<Logger>('logger.winston');
  export const LOGGER_LEVEL = BindingKey.create<LOGGER_LEVEL>('logger.level');
  export const LOGGER_ACTION = BindingKey.create<LogFn>('logger.action');
  export const METADATA = BindingKey.create<LoggerMetadata | undefined>('logger.metadata');
  export const COMPONENT = BindingKey.create<LoggingComponent>('components.LoggingComponent');
}

export enum LOGGER_LEVEL {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogFn {
  (req: Request, args: OperationArgs): Promise<void>;
}

export * from './logger-action.provider'
export * from './logger.component'
export * from './logger.decorator'
export * from './logger-metadata.provider'
