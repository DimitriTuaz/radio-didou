import { Constructor, inject, Provider } from '@loopback/context';
import { CoreBindings } from '@loopback/core';

import { LoggerMetadata, getLoggerMetadata, LOGGER_LEVEL } from '../logger';

export type LoggerEnhancedMetadata = {
  className: string,
  methodName: string
  metadata: LoggerMetadata | undefined,
}

export class LoggerMetadataProvider
  implements Provider<LoggerEnhancedMetadata | undefined> {
  constructor(
    @inject(CoreBindings.CONTROLLER_CLASS, { optional: true })
    private readonly controllerClass: Constructor<{}>,
    @inject(CoreBindings.CONTROLLER_METHOD_NAME, { optional: true })
    private readonly methodName: string
  ) { }

  /**
   * @returns LoggerMetadata
   */
  value(): LoggerEnhancedMetadata | undefined {
    if (!this.controllerClass || !this.methodName) return;
    let metadata = getLoggerMetadata(
      this.controllerClass,
      this.methodName,
    );
    return {
      className: this.controllerClass.name,
      methodName: this.methodName,
      metadata: metadata
    }
  }
}
