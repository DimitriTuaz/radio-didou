import { RadiodApplication } from './application';
import { RestBindings } from '@loopback/rest';
import { RadiodBindings } from './keys';

export async function main() {

  const app = new RadiodApplication();

  await app.boot();
  await app.migrateSchema();
  await app.init();
  await app.start();

  const port = await app.restServer.get(RestBindings.PORT);
  const host = await app.restServer.get(RestBindings.HOST);
  const config = await app.get(RadiodBindings.GLOBAL_CONFIG);

  console.log(`[Radiod] Server is listening ${host} on port ${port}`);
  console.log(`[Radiod] Visit ${config.loopback}`);

  return app;
}
