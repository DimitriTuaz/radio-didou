import { RadiodApplication } from './application';
import { writeFileSync } from 'fs';

const generator = require('openapi3-generator/lib/generator');
const path = require('path');

const template: string = 'markdown';
const output: string = '../common/openapi';
const templates: string = '../common/templates';

export async function generate(args: string[]) {
  const app = new RadiodApplication();
  await app.boot();
  try {
    writeFileSync(
      path.join(output, 'openapi.json'),
      JSON.stringify(app.restServer.getApiSpec(), null, 2)
    );
    await generator.generate({
      openapi: path.join(process.cwd(), path.join(output, 'openapi.json')),
      base_dir: process.cwd(),
      target_dir: path.join(process.cwd(), output),
      templates: path.join(process.cwd(), templates),
      curl: false,
      template
    })
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}

generate(process.argv).catch(err => {
  console.error('Cannot generate open-api specs.', err);
  process.exit(1);
});
