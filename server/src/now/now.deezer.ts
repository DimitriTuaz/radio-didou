import request from 'superagent'

import { NowFetcher, NowEnum, NowObject } from '../now';
import { inject } from '@loopback/core';
import { RadiodBindings } from '../keys';

export class NowDeezer extends NowFetcher {

  public static history_url = 'https://api.deezer.com/user/me/history';
  public static user_url = 'https://api.deezer.com/user/me';
  public static auth_url = 'https://connect.deezer.com/oauth/access_token.php';

  public name = "Deezer";

  constructor(
    @inject(RadiodBindings.NOW_TOKEN) private access_token: string,
    @inject(RadiodBindings.NOW_OBJECT, { optional: true }) current_now: NowObject,
  ) {
    super();
    if (current_now != null) {
      this.now = current_now;
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

  public async fetch(): Promise<void> {
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
      console.log("[" + this.name + "] error in obtain_current_playback")
    }
  }
}
