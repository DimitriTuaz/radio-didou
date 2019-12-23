import { inject } from '@loopback/core';
import { setIntervalAsync, SetIntervalAsyncTimer } from 'set-interval-async/dynamic';
import { clearIntervalAsync } from 'set-interval-async';

import path from 'path';
import request from 'superagent'
import fs from 'fs';

import { RadiodBindings } from '../keys';
import { NowService } from '../services';

interface ISpotifyCredential {
  authorization: string;
  refresh_token: string;
  access_token: string;
}

export class NowSpotify implements NowService {

  public static spotify_api_url = 'https://api.spotify.com/v1/me/player';
  public static spotify_token_url = 'https://accounts.spotify.com/api/token';

  private now: any = {};
  private isRunning: boolean = false;
  private intervalID: SetIntervalAsyncTimer;

  private credential: ISpotifyCredential;

  constructor(
    @inject(RadiodBindings.PROJECT_ROOT)
    private projectRoot: any) { }

  public getNow(): any {
    return this.now;
  }

  public start(): void {
    try {
      let filePath: string = path.join(this.projectRoot, 'credential_spotify.json');
      this.credential = JSON.parse(fs.readFileSync(filePath).toString());
      if (!this.isRunning) {
        console.log("[NowSpotify] started");
        this.isRunning = true;
        this.intervalID = setIntervalAsync(
          async () => await this.obtain_current_playback(true),
          3000
        );
      }
    }
    catch (e) {
      console.log("[NowSpotify] Error! Couldn't open the credential file")
    }
  }

  public async stop(): Promise<void> {
    if (this.isRunning) {
      console.log("[NowSpotify] stopped");
      await clearIntervalAsync(this.intervalID);
      this.isRunning = false;
    }
  }

  private async obtain_access_token(): Promise<void> {
    try {
      const response = await request
        .post(NowSpotify.spotify_token_url)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', 'Basic ' + this.credential.authorization)
        .send({
          grant_type: 'refresh_token',
          refresh_token: this.credential.refresh_token
        });
      const data = response.body;
      if ('access_token' in data) {
        this.credential.access_token = data.access_token;
        console.log("[NowSpotify] obtain_access_token succeeded")
      }
    }
    catch (error) {
      console.log("[NowSpotify] error in obtain_access_token")
    }
  }

  private async obtain_current_playback(retryOnce: boolean): Promise<void> {
    try {
      const response = await request
        .get(NowSpotify.spotify_api_url)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.credential.access_token);
      this.now = response.body;
    }
    catch (error) {
      if (retryOnce) {
        await this.obtain_access_token();
        await this.obtain_current_playback(false);
      }
      else {
        console.log("[NowSpotify] error in obtain_current_playback")
      }
    }
  }
}
