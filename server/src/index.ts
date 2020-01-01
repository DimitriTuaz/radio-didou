import { RadiodApplication } from './application';

import path from 'path';

export async function main() {

  const app = new RadiodApplication(path.join(__dirname, '../..'));

  await app.boot();
  await app.init();
  await app.start();


  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);

  return app;
}
