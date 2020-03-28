import { inject, Provider } from '@loopback/context';
import { OperationArgs, Request } from '@loopback/rest';
import { Getter } from '@loopback/core';
import { Logger } from 'winston';

import { LoggerMetadata, LogFn, LOGGER_LEVEL, LoggingBindings } from '../logger';

export class LoggerActionProvider implements Provider<LogFn> {

  constructor(
    @inject(LoggingBindings.LOGGER) private logger: Logger,
    @inject.getter(LoggingBindings.METADATA) private metadata: Getter<LoggerMetadata | undefined>
  ) { }

  value(): LogFn {
    return (req: Request, args: OperationArgs) => this.action(req, args);
  }

  private async action(req: Request, args: OperationArgs) {
    let metadata = await this.metadata();
    const level: LOGGER_LEVEL | undefined = metadata ? metadata.level : LOGGER_LEVEL.DEBUG;

    if (args == undefined)
      args = [];

    let msg = `${req.url}`;
    this.logger.log(level, msg);
  }
}
