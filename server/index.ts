import { MainApplication } from './application';

export { MainApplication };

export async function main() {

  const app = new MainApplication({
    rest: {
      host: "127.0.0.1",
      port: "8888"
    }
  });
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);

  return app;
}
