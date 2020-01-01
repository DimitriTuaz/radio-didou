import { inject } from '@loopback/core';

import request from 'superagent'

import { RadiodBindings } from '../keys';
import { NowService } from '../services';
import { NowEnum, INow } from '@common/now/now.common';

export class NowDeezer extends NowService {

  public static history_url = 'https://api.deezer.com/user/me/history';
  public static user_url = 'https://api.deezer.com/user/me';
  public static auth_url = 'https://connect.deezer.com/oauth/access_token.php';

  public serviceName = "NowDeezer";

  private access_token: string;

  constructor(
    @inject(RadiodBindings.CONFIG) private configuration: any,
    @inject(RadiodBindings.API_KEY) private apiKey: any) {
    super(configuration)
  }

  protected init(value?: INow, token?: string): void {
    if (token != null) {
      this.access_token = token;
    }
    if (value != null) {
      this.now = value;
    }
    else {
      this.now = {
        type: NowEnum.Deezer,
        listeners: 0,
        song: '',
        artists: [],
      }
    }
  }

  protected async fetch(): Promise<void> {
    return await this.obtain_current_playback();
  }

  private async obtain_current_playback(): Promise<void> {
    try {
      const response = await request
        .get(NowDeezer.history_url)
        .query({ access_token: this.access_token })
        .query({ output: "json" })
        .query({ limit: 1 })

      if (response.body.data != undefined) {
        this.now = {
          type: NowEnum.Deezer,
          listeners: this.now.listeners,
          song: response.body.data[0].title,
          artists: [response.body.data[0].artist.name],
          album: response.body.data[0].album.title,
          cover: response.body.data[0].album.cover_medium,
          url: response.body.data[0].album.link
        }
      }
    }
    catch (error) {
      console.log("[" + this.serviceName + "] error in obtain_current_playback")
    }
  }
}
