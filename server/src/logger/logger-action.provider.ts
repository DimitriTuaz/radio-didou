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
    return (req: Request, args: OperationArgs) => this.action(req, args);
  }

  private async action(req: Request, args: OperationArgs) {
    let enhancedMetadata = await this.metadata();
    if (enhancedMetadata == undefined) return;

    const level = enhancedMetadata.metadata ? enhancedMetadata.metadata.level : LOGGER_LEVEL.DEBUG;
    const showArgs = enhancedMetadata.metadata ? enhancedMetadata.metadata.showArgs : true;

    let msg = '';
    let string = args !== undefined ? args : [];
    if (showArgs)
      string = string.map(value => JSON.stringify(value));

    msg += `\n| Method > ${enhancedMetadata.className}.${enhancedMetadata.methodName}`;
    if (string.length > 0)
      msg += `\n| Args > ${string.join(', ')}`;
    if (enhancedMetadata.currentUser !== undefined)
      msg += `\n| UserID > ${enhancedMetadata.currentUser[securityId]}`

    this.logger.log(level, msg);
  }
}
