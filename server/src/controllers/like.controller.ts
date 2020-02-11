import { get, param, HttpErrors } from '@loopback/rest';
import { inject, BindingScope, bind } from '@loopback/core';
import { repository } from '@loopback/repository';

import { RadiodBindings } from '../keys';

import { Song } from '../models';
import { SongRepository } from '../repositories';
import { NowSpotify } from '../now';

import request = require('superagent');

@bind({ scope: BindingScope.SINGLETON })
export class LikeController {

  private access_token: string;
  public name: string = 'LikeController';

  constructor(
    @inject(RadiodBindings.API_KEY) private api_key: any,
    @repository(SongRepository) public songRepository: SongRepository
  ) { }

  @get('/like', {
    responses: {
      '200': {
        description: 'Informations about the current song',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': Song,
            },
          },
        },
      },
    },
  })
  async create(
    @param.query.string('url') url: string
  ): Promise<Song> {
    let trackURL: URL = new URL(url);
    let track: any = await this.obtain_track(trackURL, true);
    let song: Song = new Song({
      title: track.name,
      url: track.external_urls.spotify,
      artwork: track.album.images[2].url
    });
    try {
      await this.songRepository.create(song);
    } catch (error) {
      if (error.code === 11000 && error.errmsg.includes('index: uniqueURL')) {
        console.log('[' + this.name + '] Song ' + url + ' is already in DB');
      } else {
        throw error;
      }
    }
    return song;
  }

  private async obtain_track(trackURL: URL, retryOnce: boolean): Promise<any> {
    if (!trackURL.hostname.includes('spotify')) {
      throw new Error('[' + this.name + '] URL should contains \'spotify\'.');
    }
    try {
      let songId: string = trackURL.pathname.split('/')[2];
      const response = await request
        .get(NowSpotify.track_url + '/' + songId)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.access_token);
      return response.body;
    }
    catch (error) {
      if (retryOnce) {
        await this.obtain_access_token();
        return await this.obtain_track(trackURL, false);
      }
      else {
        throw error;
      }
    }
  }

  private async obtain_access_token(): Promise<void> {
    try {
      const authorization = Buffer.from(this.api_key.spotify.client_id + ':' + this.api_key.spotify.secret)
        .toString('base64');

      const response = await request
        .post(NowSpotify.token_url)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', 'Basic ' + authorization)
        .send({
          grant_type: 'client_credentials'
        });

      const data = response.body;
      if ('access_token' in data) {
        this.access_token = data.access_token;
        console.log("[" + this.name + "] obtain_access_token succeeded")
      }
    }
    catch (error) {
      console.error(error);
    }
  }
}
