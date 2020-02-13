import { get, param, getModelSchemaRef, put, del } from '@loopback/rest';
import { inject, BindingScope, bind } from '@loopback/core';
import { repository } from '@loopback/repository';

import { authenticate } from '@loopback/authentication';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';
import { UserProfile, securityId, SecurityBindings } from '@loopback/security';

import { RadiodBindings } from '../keys';

import { Song } from '../models';
import { UserRepository } from '../repositories';
import { NowSpotify } from '../now';

import request = require('superagent');

@bind({ scope: BindingScope.SINGLETON })
export class SongController {

  private access_token: string;
  public name: string = 'LikeController';

  constructor(
    @inject(RadiodBindings.API_KEY) private api_key: any,
    @repository(UserRepository) private userRepository: UserRepository,
  ) { }

  @put('/song/add', {
    security: OPERATION_SECURITY_SPEC,
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
  @authenticate('jwt')
  async add(
    @param.query.string('url') url: string,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile): Promise<Song> {
    let trackURL: URL = new URL(url);
    let track: any = await this.obtain_track(trackURL, true);
    let userId: string = currentUserProfile[securityId];
    let song: Song = new Song({
      title: track.name,
      url: track.external_urls.spotify,
      artwork: track.album.images[2].url
    });
    try {
      await this.userRepository.songs(userId).create(song);
    } catch (error) {
      if (error.code === 11000 && error.errmsg.includes('index: uniqueURL')) {
        console.log('[' + this.name + '] Song ' + url + ' is already in DB');
      } else {
        throw error;
      }
    }
    return song;
  }

  @get('/song/get', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of user\'s songs',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Song),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async get(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile): Promise<Song[]> {
    let userId: string = currentUserProfile[securityId];
    return this.userRepository.songs(userId).find();
  }

  @get('/song/is', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Return true is this is an user\'s song, false otherwise.',
        content: {
          'application/json': {
            schema: {
              type: 'boolean'
            }
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async is(
    @param.query.string('url') url: string,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile): Promise<boolean> {
    let userId: string = currentUserProfile[securityId];
    let songs: Song[] = await this.userRepository.songs(userId).find({
      where: {
        url: url
      }
    });
    return songs.length > 0;
  }

  @del('/song/delete', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'The user\'s song is deleted with success'
      },
    },
  })
  @authenticate('jwt')
  async remove(
    @param.query.string('url') url: string,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile): Promise<void> {
    let userId: string = currentUserProfile[securityId];
    await this.userRepository.songs(userId).delete({ url: url });
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
