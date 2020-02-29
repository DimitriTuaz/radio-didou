import { get, param, getModelSchemaRef, put, del, HttpErrors, post } from '@loopback/rest';
import { inject, BindingScope, bind } from '@loopback/core';
import { repository } from '@loopback/repository';
import { authenticate } from '@loopback/authentication';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';
import { UserProfile, securityId, SecurityBindings } from '@loopback/security';
import _ from 'lodash';

import { RadiodBindings } from '../keys';
import { Song, UserPower } from '../models';
import { UserRepository } from '../repositories';
import { NowSpotify, SpotifyScope } from '../now';

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
  @authenticate({ strategy: 'jwt', options: { power: UserPower.NONE } })
  async add(
    @param.query.string('url') url: string,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile
  ) {
    let trackURL: URL;
    try {
      trackURL = new URL(url);
    } catch (error) {
      console.log('[' + this.name + '] Invalid URL to add..');
      throw new HttpErrors.BadRequest('Invalid URL')
    }
    let track: any = await this.obtain_track(trackURL, true);
    let userId: string = currentUserProfile[securityId];
    let song: Song = new Song({
      title: track.name,
      album: track.album.name,
      artist: track.artists[0].name,
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
  @authenticate({ strategy: 'jwt', options: { power: UserPower.NONE } })
  async get(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile
  ) {
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
  @authenticate({ strategy: 'jwt', options: { power: UserPower.NONE } })
  async is(
    @param.query.string('url') url: string,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile
  ) {
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
  @authenticate({ strategy: 'jwt', options: { power: UserPower.NONE } })
  async remove(
    @param.query.string('url') url: string,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile
  ) {
    let userId: string = currentUserProfile[securityId];
    await this.userRepository.songs(userId).delete({ url: url });
  }

  @post('/song/synchronize', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'The synchronization with Spotify is a success.'
      },
    },
  })
  @authenticate({ strategy: 'jwt', options: { power: UserPower.NONE } })
  async synchronize(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @param.query.string('name', { required: false }) name?: string,
  ) {
    let userId: string = currentUserProfile[securityId];
    let user = await this.userRepository.findOne({
      include: [
        {
          relation: 'mediaCredentials',
          scope: {
            where: {
              scope: SpotifyScope.playlist
            }
          }
        },
      ],
      where: {
        id: userId
      }
    });

    if (user?.mediaCredentials[0].token == undefined)
      throw new HttpErrors.NotFound('Spotify playlist authorization not found.');

    let access_token = await NowSpotify.obtain_user_access_token(
      user.mediaCredentials[0].token,
      this.api_key.spotify.client_id,
      this.api_key.spotify.secret
    );

    if (access_token == undefined)
      throw new HttpErrors.NotFound('Failed to retrieve Spotify access_token');

    if (user.playlistId == undefined) {
      user.playlistId = await this.create_playlist(
        user.mediaCredentials[0].identifier,
        access_token,
        name !== undefined ? name : 'Radio-Didou');
      delete user.mediaCredentials;
      await this.userRepository.update(user);
    }

    if (user.playlistId != undefined) {
      let songs = await this.userRepository.songs(userId).find();
      await this.synchronize_playlist(
        user.playlistId,
        access_token,
        songs.map(value => {
          return 'spotify:track:' + (new URL(value.url).pathname.split('/')[2])
        })
      );
    }
  }

  private async synchronize_playlist(playlistId: string, access_token: string, uris: string[]) {
    const response = await request
      .put(NowSpotify.playlists_url + '/' + playlistId + '/tracks')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + access_token)
      .send({ uris: uris });
    return response.body.id;
  }

  private async create_playlist(spotifyId: string, access_token: string, name: string) {
    const response = await request
      .post(NowSpotify.users_url + '/' + spotifyId + '/playlists')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + access_token)
      .send({ name: name });
    return response.body.id;
  }

  private async obtain_track(trackURL: URL, retryOnce: boolean): Promise<any> {
    if (!trackURL.hostname.includes('spotify')) {
      throw new Error('[' + this.name + '] URL should contains \'spotify\'.');
    }
    try {
      let songId: string = trackURL.pathname.split('/')[2];
      const response = await request
        .get(NowSpotify.tracks_url + '/' + songId)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.access_token);
      return response.body;
    }
    catch (error) {
      if (retryOnce) {
        await this.obtain_app_access_token();
        return await this.obtain_track(trackURL, false);
      }
      else {
        throw error;
      }
    }
  }

  private async obtain_app_access_token(): Promise<void> {
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
        console.log("[" + this.name + "] obtain_app_access_token succeeded")
      }
    }
    catch (error) {
      console.error(error);
    }
  }
}
