import { inject } from '@loopback/core';

import path from 'path';
import request from 'superagent'
import fs from 'fs';

import { RadiodBindings } from '../keys';
import { NowService } from '../services';
import { NowEnum } from '@common/now/now.common';
import { url } from 'inspector';

interface IDeezerCredential {
  app_id: string;
  secret: string;
  access_token: string;
}

export class NowDeezer extends NowService {

  public static deezer_api_url = 'https://api.deezer.com/user/me/history';
  public serviceName = "NowDeezer";

  private credential: IDeezerCredential;

  constructor(
    @inject(RadiodBindings.ROOT_PATH)
    private projectRoot: any) { super() }

  protected init(): void {
    let filePath: string = path.join(this.projectRoot, 'credential_deezer.json');
    this.credential = JSON.parse(fs.readFileSync(filePath).toString());
    this.now = {
      type: NowEnum.Deezer,
    }
  }

  protected async fetch(): Promise<void> {
    return await this.obtain_current_playback();
  }

  private async obtain_current_playback(): Promise<void> {
    try {
      const response = await request
        .get(NowDeezer.deezer_api_url)
        .query({ access_token: this.credential.access_token })
        .query({ output: "json" })
        .query({ limit: 1 })

      this.now = {
        type: NowEnum.Deezer,
        song: response.body.data[0].title,
        artists: [response.body.data[0].artist.name],
        album: response.body.data[0].album.title,
        cover: response.body.data[0].album.cover_medium,
        url: response.body.data[0].album.link
      }
    }
    catch (error) {
      console.log("[" + this.serviceName + "] error in obtain_current_playback")
    }
  }
}
