export declare class NowService {
    private credential;
    static spotify_api_url: string;
    static spotify_token_url: string;
    private now;
    private isRunning;
    private intervalID;
    private access_token;
    constructor(credential: any);
    getNow(): any;
    start(): void;
    stop(): Promise<void>;
    private obtain_access_token;
    private obtain_current_playback;
}
