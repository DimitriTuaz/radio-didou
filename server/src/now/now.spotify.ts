import request from 'superagent'

import { NowFetcher } from '../now';
import { NowEnum, INow } from '@common/now/now.common';

export class NowSpotify extends NowFetcher {

  public static player_url = 'https://api.spotify.com/v1/me/player';
  public static user_url = 'https://api.spotify.com/v1/me'
  public static token_url = 'https://accounts.spotify.com/api/token';

  public name = "Spotify";

  private access_token: string;
  private refresh_token: string;
  private api_key: any;

  constructor(token: string, api_key: any, value?: INow) {
    super();
    this.refresh_token = token;
    this.api_key = api_key;
    if (value != null) {
      this.now = value;
    }
    else {
      this.now = {
        type: NowEnum.Spotify,
        listeners: 0,
        song: '',
        artists: [],
      }
    }
  }

  public async fetch(): Promise<void> {
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
          listeners: this.now.listeners,
          song: response.body.item.name,
          artists: Array.from(response.body.item.artists, (item: any) => item.name),
          album: response.body.item.album.name,
          release_date: response.body.item.album.release_date,
          cover: response.body.item.album.images[1].url,
          url: response.body.item.external_urls.spotify
        }
      }
      else {
        this.now = {
          type: NowEnum.Spotify,
          listeners: this.now.listeners,
          song: '',
          artists: [],
        }
      }
    }
    catch (error) {
      if (retryOnce) {
        await this.obtain_access_token();
        await this.obtain_current_playback(false);
      }
      else {
        console.log("[" + this.name + "] error in obtain_current_playback")
      }
    }
  }

  private async obtain_access_token(): Promise<void> {
    try {
      const authorization = Buffer.from(this.api_key.client_id + ':' + this.api_key.secret)
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
        console.log("[" + this.name + "] obtain_access_token succeeded")
      }
    }
    catch (error) {
      console.log("[" + this.name + "] error in obtain_access_token")
    }
  }
}
