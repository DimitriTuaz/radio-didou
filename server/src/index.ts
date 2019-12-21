import { RadiodApplication } from './application';

export async function main() {

  const app = new RadiodApplication({
    rest: {
      host: "127.0.0.1",
      port: "8888"
    }
  });

  await app.boot();
  await app.init();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);

  return app;
}
