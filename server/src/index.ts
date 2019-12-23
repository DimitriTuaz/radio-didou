import { RadiodApplication } from './application';

export async function main() {

  const app = new RadiodApplication({
    rest: {
      host: "0.0.0.0",
      port: "8888"
    }
  });

  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);

  return app;
}
