import { RadiodApplication } from './application';

export async function main() {

  const app = new RadiodApplication();

  await app.boot();
  await app.migrateSchema();
  await app.init();
  await app.start();


  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);

  return app;
}
