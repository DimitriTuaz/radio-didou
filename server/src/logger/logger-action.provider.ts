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

  value(): LogFn { return (req, args, start) => this.action(req, args, start); }

  private async action(req: Request, args: OperationArgs, start: bigint) {

    let timems: bigint = (process.hrtime.bigint() - start) / BigInt(1e+6);
    let enhancedMetadata = await this.metadata();
    let msg: string = '';

    if (enhancedMetadata == undefined) return;

    const level = enhancedMetadata.metadata ? enhancedMetadata.metadata.level : LOGGER_LEVEL.DEBUG;
    const showArgs = enhancedMetadata.metadata ? enhancedMetadata.metadata.showArgs : true;

    let string = args !== undefined ? args : [];
    if (showArgs)
      string = string.map(value => JSON.stringify(value));

    msg += `ip=${req.ip} - `;
    if (enhancedMetadata.currentUser !== undefined)
      msg += `userId=${enhancedMetadata.currentUser[securityId]} - `
    msg += `time=${timems}ms - `;
    msg += `method=${enhancedMetadata.className}.${enhancedMetadata.methodName}`;
    if (string.length > 0)
      msg += `\n| args > ${string.join(', ')}`;

    this.logger.log(level, msg);
  }
}
