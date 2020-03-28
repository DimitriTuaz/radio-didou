import { inject, Provider } from '@loopback/context';
import { OperationArgs, Request } from '@loopback/rest';

import { RadiodLogBindings } from '../keys';
import { LoggingBindings, WinstonLogger } from '@loopback/extension-logging';

import { getLogMetadata, LoggerMetadata } from '../logger'
import { CoreBindings, Constructor, Getter } from '@loopback/core';

export enum LOG_LEVEL {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogFn {
  (req: Request, args: OperationArgs): Promise<void>;
}

export class LogActionProvider implements Provider<LogFn> {

  @inject(LoggingBindings.WINSTON_LOGGER) private logger: WinstonLogger;
  @inject(RadiodLogBindings.LOG_LEVEL) private level: string;

  constructor(
    @inject.getter(RadiodLogBindings.METADATA) private metadata: Getter<LoggerMetadata | undefined>
  ) { }

  value(): LogFn {
    return (req: Request, args: OperationArgs) => this.action(req, args);
  }

  private async action(req: Request, args: OperationArgs) {
    let metadata = await this.metadata();
    const level: LOG_LEVEL | undefined = metadata ? metadata.level : LOG_LEVEL.DEBUG;

    if (args == undefined)
      args = [];

    let msg = `${req.url}`;
    this.logger.log(level, msg);
  }
}
