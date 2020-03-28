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

    const level: LOGGER_LEVEL | undefined = enhancedMetadata.metadata ? enhancedMetadata.metadata.level : LOGGER_LEVEL.DEBUG;

    if (args == undefined)
      args = [];

    let msg = '';
    if (enhancedMetadata.currentUser !== undefined)
      msg += `{userID=${enhancedMetadata.currentUser[securityId]}} `
    msg += `|> ${enhancedMetadata.className}.${enhancedMetadata.methodName}(${args.join(', ')})`;
    this.logger.log(level, msg);
  }
}
