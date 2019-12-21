"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var NowService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@loopback/core");
const dynamic_1 = require("set-interval-async/dynamic");
const set_interval_async_1 = require("set-interval-async");
const axios_1 = __importDefault(require("axios"));
let NowService = NowService_1 = class NowService {
    constructor(credential) {
        this.credential = credential;
        this.now = {};
        this.isRunning = false;
        this.access_token = '';
    }
    getNow() {
        return this.now;
    }
    start() {
        if (!this.isRunning) {
            console.log("[NowService] started");
            this.isRunning = true;
            this.intervalID = dynamic_1.setIntervalAsync(async () => await this.obtain_current_playback(true), 3000);
        }
    }
    async stop() {
        if (this.isRunning) {
            console.log("[NowService] stopped");
            await set_interval_async_1.clearIntervalAsync(this.intervalID);
            this.isRunning = false;
        }
    }
    async obtain_access_token() {
        try {
            const response = await axios_1.default({
                method: 'post',
                url: NowService_1.spotify_token_url,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + this.credential.authorization
                },
                params: {
                    grant_type: 'refresh_token',
                    refresh_token: this.credential.refresh_token
                }
            });
            const data = response.data;
            if ('access_token' in data) {
                this.access_token = data.access_token;
                console.log("[NowService] obtain_access_token succeeded");
            }
        }
        catch (error) {
            console.log("[NowService] error in obtain_access_token");
        }
    }
    async obtain_current_playback(retryOnce) {
        try {
            const response = await axios_1.default({
                method: 'get',
                url: NowService_1.spotify_api_url,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.access_token
                },
            });
            this.now = response.data;
        }
        catch (error) {
            if (retryOnce) {
                await this.obtain_access_token();
                await this.obtain_current_playback(false);
            }
            else {
                console.log("[NowService] error in obtain_current_playback");
            }
        }
    }
};
NowService.spotify_api_url = 'https://api.spotify.com/v1/me/player';
NowService.spotify_token_url = 'https://accounts.spotify.com/api/token';
NowService = NowService_1 = __decorate([
    core_1.bind({ scope: core_1.BindingScope.SINGLETON }),
    __param(0, core_1.inject('radiod.now-crendential')),
    __metadata("design:paramtypes", [Object])
], NowService);
exports.NowService = NowService;
//# sourceMappingURL=now.service.js.map