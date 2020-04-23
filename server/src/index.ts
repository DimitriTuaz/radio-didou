import { RadiodApplication } from './application';
import { RestBindings } from '@loopback/rest';
import { CoreBindings } from '@loopback/core';
import { LoggingBindings } from './logger';

export async function main() {

  const app = new RadiodApplication();

  await app.boot();
  await app.start();

  const port = await app.restServer.get(RestBindings.PORT);
  const host = await app.restServer.get(RestBindings.HOST);
  const config = await app.get(CoreBindings.APPLICATION_CONFIG);
  const logger = await app.get(LoggingBindings.LOGGER);

  logger.info(`Server is listening ${host} on port ${port}`);

  if (host !== undefined && ['127.0.0.1', 'localhost'].includes(host))
    logger.info(`Visit http://${config.rest.host}:${config.rest.port}`);

  return app;
}
