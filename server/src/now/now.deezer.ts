import { inject } from '@loopback/core';
import { setIntervalAsync, SetIntervalAsyncTimer } from 'set-interval-async/dynamic';
import { clearIntervalAsync } from 'set-interval-async';

import path from 'path';
import request from 'superagent'
import fs from 'fs';

import { RadiodBindings } from '../keys';
import { NowService } from '../services';

interface IDeezerCredential {
  app_id: string;
  secret: string;
  access_token: string;
}

export class NowDeezer implements NowService {

  public static deezer_api_url = 'https://api.deezer.com/user/me/history';

  private now: any = {};
  private isRunning: boolean = false;
  private intervalID: SetIntervalAsyncTimer;

  private credential: IDeezerCredential;

  constructor(
    @inject(RadiodBindings.PROJECT_ROOT)
    private projectRoot: any) { }

  public getNow(): any {
    return this.now;
  }

  public start(): void {
    try {
      let filePath: string = path.join(this.projectRoot, 'credential_deezer.json');
      this.credential = JSON.parse(fs.readFileSync(filePath).toString());
      if (!this.isRunning) {
        console.log("[NowDeezer] started");
        this.isRunning = true;
        this.intervalID = setIntervalAsync(
          async () => await this.obtain_current_playback(),
          3000
        );
      }
    }
    catch (e) {
      console.log("[NowDeezer] Error! Couldn't open the credential file")
    }
  }

  public async stop(): Promise<void> {
    if (this.isRunning) {
      console.log("[NowDeezer] stopped");
      await clearIntervalAsync(this.intervalID);
      this.isRunning = false;
    }
  }

  private async obtain_current_playback(): Promise<void> {
    try {
      const response = await request
        .get(NowDeezer.deezer_api_url)
        .query({ access_token: this.credential.access_token })
        .query({ output: "json" })
        .query({ limit: 1 })
      this.now = response.body;
    }
    catch (error) {
      console.log("[NowDeezer] error in obtain_current_playback")
    }
  }
}
