import {
  get,
  param,
  getModelSchemaRef,
  RestBindings,
  Request,
  Response,
  del
} from '@loopback/rest';
import {
  inject,
  BindingScope,
  bind,
  CoreBindings
} from '@loopback/core';
import { repository } from '@loopback/repository';

import { authenticate } from '@loopback/authentication';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';
import { UserProfile, securityId, SecurityBindings } from '@loopback/security';

import request from 'superagent'
import { Logger } from 'winston';

import { NowSpotify, SpotifyScope, NowEnum, NowDeezer } from '../now';
import { MediaCredentials, UserPower, User } from '../models';
import { UserRepository, MediaCredentialsRepository } from '../repositories';
import { logger, LOGGER_LEVEL, LoggingBindings } from '../logger';

@bind({ scope: BindingScope.SINGLETON })
export class MediaController {
  constructor(
    @inject(CoreBindings.APPLICATION_CONFIG) private global_config: any,
    @repository(MediaCredentialsRepository) private credentialRepository: MediaCredentialsRepository,
    @repository(UserRepository) private userRepository: UserRepository,
    @inject(LoggingBindings.LOGGER) private logger: Logger
  ) { }

  /**
  ** For a given scope, return an array with the user crendential
  **/
  @get('/media/find', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of Credential model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(MediaCredentials),
            },
          },
        },
      },
    },
  })
  @authenticate({ strategy: 'jwt', options: { power: UserPower.NONE } })
  async find(
    @param.query.string('scope') scope: string,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile): Promise<MediaCredentials[]> {
    let userId: string = currentUserProfile[securityId];
    return await this.userRepository.mediaCredentials(userId).find({
      where: {
        scope: scope
      }
    });
  }

  /**
  ** Delete the crendential with the given ID.
  **/
  @del('/media/delete/{credentialId}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Credential DELETE success',
      },
    },
  })
  @authenticate({ strategy: 'jwt', options: { power: UserPower.NONE } })
  async deleteById(
    @param.path.string('credentialId') credentialId: string,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile): Promise<void> {
    let userId: string = currentUserProfile[securityId];
    let user: User = await this.userRepository.findById(userId);
    let credential: MediaCredentials = await this.credentialRepository.findById(credentialId);
    await this.userRepository.mediaCredentials(userId).delete({
      id: credentialId
    });
    if (credential.scope == SpotifyScope.playlist) {
      user.playlistId = undefined;
      await this.userRepository.update(user);
    }
  }

  /**
  ** Callback to add the credentials.
  **/
  @get('/media/{serviceId}/callback', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Add your credential to Radiod and redirect to /close',
      },
    },
  })
  @logger(LOGGER_LEVEL.INFO)
  @authenticate({ strategy: 'jwt', options: { power: UserPower.NONE } })
  async create(
    @param.path.number('serviceId') serviceId: number,
    @param.query.string('code') code: string,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @inject(RestBindings.Http.REQUEST) request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response): Promise<void> {

    let userId: string = currentUserProfile[securityId];
    let token: string = '';
    let identifier: string = '';
    let name: string | undefined = undefined;
    let scope: string | undefined = undefined;

    switch (serviceId) {
      case NowEnum.Spotify:
        {
          let redirect_uri: string;
          if (this.global_config.loopback !== undefined) {
            redirect_uri = this.global_config.loopback + '/media/1/callback';
          }
          else {
            let protocol: string = request.protocol;
            if (request.headers['x_forwarded_proto'])
              protocol = request.headers['x_forwarded_proto'] as string;
            redirect_uri = protocol + '://' + request.headers.host + '/media/1/callback';
          }

          let data = await this.obtainSpotifyToken(code, redirect_uri);
          token = data.refresh_token;
          [identifier, name] = await this.obtainSpotifyUser(data.access_token);
          scope = data.scope;
          break;
        }
      case NowEnum.Deezer:
        {
          token = await this.obtainDeezerToken(code);
          [identifier, name] = await this.obtainDeezerUser(token);
          break;
        }
    }

    await this.userRepository.mediaCredentials(userId).create(new MediaCredentials({
      name: name,
      type: serviceId,
      token: token,
      identifier: identifier,
      scope: scope
    }));
    response.redirect('/close');
  }

  private async obtainSpotifyToken(code: string, redirect_uri: string): Promise<any> {
    const authorization = Buffer.from(this.global_config.spotify.client_id + ':' + this.global_config.spotify.secret)
      .toString('base64');
    const response = await request
      .post(NowSpotify.token_url)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', 'Basic ' + authorization)
      .send({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirect_uri
      });
    return response.body;
  }

  private async obtainSpotifyUser(access_token: string) {
    try {
      const response = await request
        .get(NowSpotify.me_url)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + access_token);
      return [response.body.id, response.body.display_name];
    }
    catch (e) {
      this.logger.warn('[MediaController] error: unable to obtain spotify name.');
    }
    return 'Undefined Account';
  }

  private async obtainDeezerToken(code: string) {
    const response = await request
      .get(NowDeezer.auth_url)
      .query({ app_id: this.global_config.deezer.app_id })
      .query({ secret: this.global_config.deezer.secret })
      .query({ code: code })
      .query({ output: "json" });
    return response.body.access_token;
  }

  private async obtainDeezerUser(access_token: string) {
    try {
      const response = await request
        .get(NowDeezer.user_url)
        .query({ access_token: access_token })
        .query({ output: "json" })
      return [response.body.id, response.body.name];
    }
    catch (e) {
      this.logger.warn('[MediaController] error: unable to obtain deezer name.');
    }
    return 'Undefined Account';
  }
}
