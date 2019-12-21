import { NowService } from '../services/now.service';
export declare class NowController {
    service: NowService;
    constructor(service: NowService);
    now(): any;
}
