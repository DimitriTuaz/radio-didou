import { Provider } from '@loopback/context';
import { LogError, Request } from '@loopback/rest';
import { inject, Getter } from '@loopback/core';

import { Logger } from 'winston';

import { LoggingBindings, LoggerEnhancedMetadata, LOGGER_LEVEL } from '../logger';

export class LoggerErrorProvider implements Provider<LogError> {

  constructor(
    @inject(LoggingBindings.LOGGER) private logger: Logger,
    @inject.getter(LoggingBindings.METADATA) private metadata: Getter<LoggerEnhancedMetadata | undefined>
  ) { }

  value(): LogError {
    return (err, statusCode, req) => this.action(err, statusCode, req);
  }

  private async action(err: Error, statusCode: number, req: Request) {
    if (statusCode < 500) {
      return;
    }
    let msg: string = '';
    let info = await this.metadata();

    msg += `ip=${req.ip} - `;
    msg += `statusCode=${statusCode} - `;

    if (info !== undefined)
      msg += `Unhandled error in ${info.className}.${info.methodName}`;
    else
      msg += `Unhandled error in ${req.url}`;

    this.logger.log({
      level: LOGGER_LEVEL.ERROR,
      message: msg,
      error: err.stack ?? err
    })
  }
}
