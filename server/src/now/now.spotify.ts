import { inject, CoreBindings } from '@loopback/core';
import request from 'superagent'
import { Logger } from 'winston';

import { NowFetcher, NowEnum } from '../now';
import { RadiodBindings, NowServiceBindings } from '../keys';
import { LoggingBindings } from '../logger';

export enum SpotifyScope {
  playback = 'user-read-playback-state',
  playlist = 'playlist-modify-public'
}

export class NowSpotify extends NowFetcher {

  public static player_url = 'https://api.spotify.com/v1/me/player';
  public static me_url = 'https://api.spotify.com/v1/me'
  public static token_url = 'https://accounts.spotify.com/api/token';
  public static tracks_url = 'https://api.spotify.com/v1/tracks';
  public static users_url = 'https://api.spotify.com/v1/users';
  public static playlists_url = 'https://api.spotify.com/v1/playlists';

  public name = "Spotify";

  private access_token: string | undefined;
  private api_key: any;

  constructor(
    @inject(LoggingBindings.LOGGER) private logger: Logger,
    @inject(NowServiceBindings.NOW_TOKEN) private refresh_token: string,
    @inject(CoreBindings.APPLICATION_CONFIG) config: any
  ) {
    super();
    this.api_key = config.spotify;
    this.now = {
      type: NowEnum.Spotify,
      listeners: 0,
      song: '',
      artists: [],
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
        this.access_token = await NowSpotify.obtain_user_access_token(
          this.refresh_token,
          this.api_key.client_id,
          this.api_key.secret
        );
        await this.obtain_current_playback(false);
      }
      else {
        this.logger.warn("{" + this.name + "} error in obtain_current_playback")
      }
    }
  }

  public static async obtain_user_access_token(
    refresh_token: string | undefined,
    client_id: string,
    secret: string
  ): Promise<string | undefined> {
    if (refresh_token == undefined)
      throw new Error('Please provide a refresh token');

    const authorization = Buffer.from(client_id + ':' + secret)
      .toString('base64');

    const response = await request
      .post(NowSpotify.token_url)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', 'Basic ' + authorization)
      .send({
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      });

    const data = response.body;
    if ('access_token' in data) {
      return data.access_token;
    }
  }
}
