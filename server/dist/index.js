"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const application_1 = require("./application");
async function main() {
    const app = new application_1.RadiodApplication({
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
exports.main = main;
//# sourceMappingURL=index.js.map