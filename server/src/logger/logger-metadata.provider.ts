import { Constructor, inject, Provider } from '@loopback/context';
import { CoreBindings } from '@loopback/core';
import { LoggerMetadata, getLogMetadata } from '../logger'

/**
 * Provides logger metadata of a controller method
 * @example `context.bind('logger.metadata').toProvider(LoggerMetadataProvider)`
 */
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
    const metadata = getLogMetadata(
      this.controllerClass,
      this.methodName,
    );
    return metadata;
  }
}
