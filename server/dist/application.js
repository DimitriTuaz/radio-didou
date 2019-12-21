"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const boot_1 = require("@loopback/boot");
const rest_explorer_1 = require("@loopback/rest-explorer");
const rest_1 = require("@loopback/rest");
const path_1 = __importDefault(require("path"));
const sequence_1 = require("./sequence");
const context_1 = require("@loopback/context");
const now_service_1 = require("./services/now.service");
const fs_1 = __importDefault(require("fs"));
class RadiodApplication extends boot_1.BootMixin(rest_1.RestApplication) {
    constructor(options = {}) {
        super(options);
        this.projectRoot = __dirname;
        this.sequence(sequence_1.MainSequence);
        this.static('/', path_1.default.join(__dirname, '../../static'));
        this.static('/jingles', path_1.default.join(__dirname, '../../static/jingles.html'));
        this.bind(rest_explorer_1.RestExplorerBindings.CONFIG).to({
            path: '/explorer'
        });
        this.component(rest_explorer_1.RestExplorerComponent);
        this.bootOptions = {
            controllers: {
                dirs: ['controllers'],
                extensions: ['.controller.js'],
                nested: true,
            },
        };
        this.initNowService();
    }
    async initNowService() {
        this.bind('radiod.now-crendential').toDynamicValue(() => {
            let rawdata = fs_1.default.readFileSync(path_1.default.join(__dirname, '../../credential.json'));
            let data = JSON.parse(rawdata.toString());
            return data;
        });
        this.bind('radiod.now-service')
            .toClass(now_service_1.NowService)
            .inScope(context_1.BindingScope.SINGLETON);
        var service = await this.get('radiod.now-service');
        service.start();
    }
}
exports.RadiodApplication = RadiodApplication;
//# sourceMappingURL=application.js.map