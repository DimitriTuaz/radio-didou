import { inject, Provider } from '@loopback/context';
import { OperationArgs, Request } from '@loopback/rest';
import { Getter } from '@loopback/core';
import { securityId } from '@loopback/security';
import { Logger } from 'winston';

import { LogFn, LoggingBindings, LoggerEnhancedMetadata, LOGGER_LEVEL } from '../logger';

export class LoggerActionProvider implements Provider<LogFn> {

  constructor(
    @inject(LoggingBindings.LOGGER) private logger: Logger,
    @inject.getter(LoggingBindings.METADATA) private metadata: Getter<LoggerEnhancedMetadata | undefined>
  ) { }

  value(): LogFn {
    return (req, args, start) => this.action(req, args, start);
  }

  private async action(req: Request, args: OperationArgs, start: bigint) {

    let time: bigint = (process.hrtime.bigint() - start) / BigInt(1e+6);
    let info = await this.metadata();
    let msg: string = '';

    if (info == undefined) return;

    const level = info.metadata ? info.metadata.level : LOGGER_LEVEL.DEBUG;

    msg += `ip=${req.ip} - `;
    if (info.currentUser !== undefined)
      msg += `userId=${info.currentUser[securityId]} - `
    msg += `time=${time}ms - `;
    msg += `method=${info.className}.${info.methodName}`;

    this.logger.log(level, msg);
  }
}
