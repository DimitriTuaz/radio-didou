import { Constructor, inject, Provider } from '@loopback/context';
import { CoreBindings } from '@loopback/core';

import { LoggerMetadata, getLoggerMetadata } from '../logger';

export class LoggerMetadataProvider
  implements Provider<LoggerMetadata | undefined> {
  constructor(
    @inject(CoreBindings.CONTROLLER_CLASS, { optional: true })
    private readonly controllerClass: Constructor<{}>,
    @inject(CoreBindings.CONTROLLER_METHOD_NAME, { optional: true })
    private readonly methodName: string
  ) { }

  /**
   * @returns LoggerMetadata
   */
  value(): LoggerMetadata | undefined {
    if (!this.controllerClass || !this.methodName) return;
    const metadata = getLoggerMetadata(
      this.controllerClass,
      this.methodName,
    );
    return metadata;
  }
}
