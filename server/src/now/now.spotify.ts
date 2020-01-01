import { inject } from '@loopback/core';

import request from 'superagent'

import { RadiodBindings } from '../keys';
import { NowService } from '../services';
import { NowEnum, INow } from '@common/now/now.common';

export class NowSpotify extends NowService {

  public static player_url = 'https://api.spotify.com/v1/me/player';
  public static user_url = 'https://api.spotify.com/v1/me'
  public static token_url = 'https://accounts.spotify.com/api/token';

  public serviceName = "NowSpotify";

  private access_token: string;
  private refresh_token: string;

  constructor(
    @inject(RadiodBindings.API_KEY) private apiKey: any) { super() }

  protected init(value?: INow, token?: string): void {
    if (token != null) {
      this.refresh_token = token;
    }
    if (value != null) {
      this.now = value;
    }
    else {
      this.now = {
        type: NowEnum.Spotify,
        song: '',
        artists: [],
      }
    }
  }

  protected async fetch(): Promise<void> {
    return await this.obtain_current_playback(true);
  }

  private async obtain_current_playback(retryOnce: boolean): Promise<void> {
    try {
      const response = await request
        .get(NowSpotify.player_url)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.access_token);

      if (response.body.item != undefined) {
        this.now = {
          type: NowEnum.Spotify,
          song: response.body.item.name,
          artists: Array.from(response.body.item.artists, (item: any) => item.name),
          album: response.body.item.album.name,
          release_date: response.body.item.album.release_date,
          cover: response.body.item.album.images[1].url,
          url: response.body.item.external_urls.spotify
        }
      }
    }
    catch (error) {
      if (retryOnce) {
        await this.obtain_access_token();
        await this.obtain_current_playback(false);
      }
      else {
        console.log("[" + this.serviceName + "] error in obtain_current_playback")
      }
    }
  }

  private async obtain_access_token(): Promise<void> {
    try {
      const authorization = Buffer.from(this.apiKey.spotify.client_id + ':' + this.apiKey.spotify.secret)
        .toString('base64');

      const response = await request
        .post(NowSpotify.token_url)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', 'Basic ' + authorization)
        .send({
          grant_type: 'refresh_token',
          refresh_token: this.refresh_token
        });
      const data = response.body;
      if ('access_token' in data) {
        this.access_token = data.access_token;
        console.log("[" + this.serviceName + "] obtain_access_token succeeded")
      }
    }
    catch (error) {
      console.log("[" + this.serviceName + "] error in obtain_access_token")
    }
  }
}
