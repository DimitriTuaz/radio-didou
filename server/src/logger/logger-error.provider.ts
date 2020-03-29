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
    let message: string;
    let metadata = await this.metadata();

    if (metadata !== undefined)
      message = `{url=${req.url}, statusCode=${statusCode}} |> Unhandled error in ${metadata.className}.${metadata.methodName}`;
    else
      message = `{statusCode=${statusCode}} |> Unhandled error in ${req.url}`;

    this.logger.log({
      level: LOGGER_LEVEL.ERROR,
      message: message,
      error: err.stack ?? err
    })
  }
}
