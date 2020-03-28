import { inject, Provider } from '@loopback/context';
import { OperationArgs, Request } from '@loopback/rest';

import { RadiodLogBindings } from '../keys';
import { LoggingBindings, WinstonLogger } from '@loopback/extension-logging';

import { getLogMetadata } from '../logger'
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
    @inject.getter(CoreBindings.CONTROLLER_CLASS)
    private controllerClass: Getter<Constructor<{}>>,
    @inject.getter(CoreBindings.CONTROLLER_METHOD_NAME)
    private methodName: Getter<string>
  ) { }

  value(): LogFn {
    return (req: Request, args: OperationArgs) => this.action(req, args);
  }

  private async action(req: Request, args: OperationArgs) {
    const controllerClass = await this.controllerClass();
    const methodName = await this.methodName();
    if (!this.controllerClass || !this.methodName) return;
    const metadata = getLogMetadata(
      controllerClass,
      methodName,
    );

    const level: LOG_LEVEL | undefined = metadata ? metadata.level : undefined;

    if (level !== undefined) {
      if (args == undefined)
        args = [];
      let msg = `${req.url} :: ${controllerClass.name}.`;
      msg += `${methodName}(${args.join(', ')}) => `;
      this.logger.log(level, msg);
    }
  }
}
