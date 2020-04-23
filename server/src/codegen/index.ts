import { BootMixin } from '@loopback/boot';
import { RestApplication } from '@loopback/rest';
import { RepositoryMixin } from '@loopback/repository';

import { generate } from './generator';

import path from 'path';

class LBApplication extends BootMixin(RepositoryMixin(RestApplication)) { }

export async function main() {
  const app = new LBApplication();
  app.projectRoot = path.join(__dirname, '..');
  await app.boot();

  let rootDir = path
    .join(app.projectRoot, '..', '..');

  let openAPI = await app.restServer.getApiSpec();
  await generate({
    openAPI: openAPI,
    basePath: path.join(rootDir, 'openapi'),
    templatePath: path.join(rootDir, 'openapi', 'templates')
  });
  process.exit(0);
}

main()
  .catch(err => {
    console.error('Cannot generate open-api client.', err);
    process.exit(1);
  });
