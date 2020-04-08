import { inject, Setter, Getter } from '@loopback/core';
import { LoggingBindings } from '../logger';

import request from 'superagent'
import { Logger } from 'winston';

import { NowFetcher, NowEnum } from './now.fetcher';
import { NowBindings } from './now.keys';
import { NowObject } from './now.component';

export class NowDeezer extends NowFetcher {

  public static history_url = 'https://api.deezer.com/user/me/history';
  public static user_url = 'https://api.deezer.com/user/me';
  public static auth_url = 'https://connect.deezer.com/oauth/access_token.php';

  public name = "Deezer";

  constructor(
    @inject(LoggingBindings.LOGGER) private logger: Logger,
    @inject(NowBindings.NOW_TOKEN) private access_token: string,
    @inject.getter(NowBindings.CURRENT_NOW) private nowGetter: Getter<NowObject>,
    @inject.setter(NowBindings.CURRENT_NOW) private nowSetter: Setter<NowObject>
  ) {
    super();
  }

  public async fetch(): Promise<void> {
    return await this.obtain_current_playback();
  }

  private async obtain_current_playback(): Promise<void> {
    let now: NowObject = await this.nowGetter();
    try {
      const response = await request
        .get(NowDeezer.history_url)
        .query({ access_token: this.access_token })
        .query({ output: "json" })
        .query({ limit: 1 })

      if (response.body.data != undefined) {
        this.nowSetter({
          type: NowEnum.Deezer,
          listeners: now.listeners,
          song: response.body.data[0].title,
          artists: [response.body.data[0].artist.name],
          album: response.body.data[0].album.title,
          cover: response.body.data[0].album.cover_medium,
          url: response.body.data[0].album.link
        });
      }
    }
    catch (error) {
      this.logger.warn("[" + this.name + "] error in obtain_current_playback")
    }
  }
}
