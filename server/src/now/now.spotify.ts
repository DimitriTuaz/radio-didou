import { inject } from '@loopback/core';

import path from 'path';
import request from 'superagent'
import fs from 'fs';

import { RadiodBindings } from '../keys';
import { NowService } from '../services';
import { NowEnum } from '@common/now/now.common';

interface ISpotifyCredential {
  authorization: string;
  refresh_token: string;
  access_token: string;
}

export class NowSpotify extends NowService {

  public static spotify_api_url = 'https://api.spotify.com/v1/me/player';
  public static spotify_token_url = 'https://accounts.spotify.com/api/token';
  public serviceName = "NowSpotify";

  private credential: ISpotifyCredential;

  constructor(
    @inject(RadiodBindings.ROOT_PATH)
    private projectRoot: any) { super() }

  protected init(): void {
    let filePath: string = path.join(this.projectRoot, 'credential_spotify.json');
    this.credential = JSON.parse(fs.readFileSync(filePath).toString());
    this.now = {
      type: NowEnum.Spotify,
      song: '',
      artists: [],
    }
  }

  protected async fetch(): Promise<void> {
    return await this.obtain_current_playback(true);
  }

  private async obtain_current_playback(retryOnce: boolean): Promise<void> {
    try {
      const response = await request
        .get(NowSpotify.spotify_api_url)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.credential.access_token);

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
        console.log("[" + this.serviceName + "] obtain_access_token succeeded")
      }
    }
    catch (error) {
      console.log("[" + this.serviceName + "] error in obtain_access_token")
    }
  }
}
