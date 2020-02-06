import { RadiodApplication } from './application';
import { writeFileSync } from 'fs';

export async function generate(args: string[]) {
  const app = new RadiodApplication();
  await app.boot();
  try {
    writeFileSync("dist/openapi.json", JSON.stringify(app.restServer.getApiSpec()));
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}

generate(process.argv).catch(err => {
  console.error('Cannot generate open-api specs.', err);
  process.exit(1);
});
