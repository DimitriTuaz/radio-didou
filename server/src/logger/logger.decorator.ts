import {
  Constructor,
  MethodDecoratorFactory,
  MetadataInspector,
} from '@loopback/context';

import { LOG_LEVEL } from '../logger'
import { RadiodLogBindings } from '../keys';

export type LoggerMetadata = { level: LOG_LEVEL };

/**
 * Mark a controller method as requiring logging
 *
 * @param level - The Log Level
 */
export function log(level?: LOG_LEVEL) {
  if (level === undefined) level = LOG_LEVEL.WARN;
  return MethodDecoratorFactory.createDecorator<LoggerMetadata>(
    RadiodLogBindings.METADATA,
    {
      level,
    },
  );
}

/**
 * Fetch log level stored by `@log` decorator.
 *
 * @param controllerClass - Target controller
 * @param methodName - Target method
 */
export function getLogMetadata(controllerClass: Constructor<{}>, methodName: string) {
  return (
    MetadataInspector.getMethodMetadata<LoggerMetadata>(
      RadiodLogBindings.METADATA,
      controllerClass.prototype,
      methodName,
    )
  );
}
