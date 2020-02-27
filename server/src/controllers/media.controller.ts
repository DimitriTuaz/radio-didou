import { get, param, getModelSchemaRef, RestBindings, Request, Response, del } from '@loopback/rest';
import { inject, BindingScope, bind } from '@loopback/core';
import { repository } from '@loopback/repository';

import { authenticate } from '@loopback/authentication';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';
import { UserProfile, securityId, SecurityBindings } from '@loopback/security';

import { RadiodBindings } from '../keys';

import { NowDeezer, NowSpotify, NowEnum } from '../now';
import { MediaCredentials } from '../models';
import { UserRepository } from '../repositories';

import request = require('superagent');

@bind({ scope: BindingScope.SINGLETON })
export class MediaController {
  constructor(
    @inject(RadiodBindings.API_KEY) private api_key: any,
    @inject(RadiodBindings.GLOBAL_CONFIG) private global_config: any,
    @repository(UserRepository) private userRepository: UserRepository,
  ) { }

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
  @authenticate('jwt')
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


  @del('/media/delete/{credentialId}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Credential DELETE success',
      },
    },
  })
  @authenticate('jwt')
  async deleteById(
    @param.path.string('credentialId') credentialId: string,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile): Promise<void> {
    let userId: string = currentUserProfile[securityId];
    await this.userRepository.mediaCredentials(userId).delete({
      id: credentialId
    });
  }

  @get('/media/{serviceId}/callback', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Add your credential to Radiod and redirect to /close',
      },
    },
  })
  @authenticate('jwt')
  async create(
    @param.path.number('serviceId') serviceId: number,
    @param.query.string('code') code: string,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @inject(RestBindings.Http.REQUEST) request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response): Promise<void> {

    let userId: string = currentUserProfile[securityId];
    let token: string = '';

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
          name = await this.obtainSpotifyName(data.access_token);
          scope = data.scope;
          break;
        }
      case NowEnum.Deezer:
        {
          token = await this.obtainDeezerToken(code);
          name = await this.obtainDeezerName(token);
          break;
        }
    }

    await this.userRepository.mediaCredentials(userId).create(new MediaCredentials({
      name: name,
      type: serviceId,
      token: token,
      scope: scope
    }));
    response.redirect('/close');
  }

  private async obtainSpotifyToken(code: string, redirect_uri: string): Promise<any> {
    const authorization = Buffer.from(this.api_key.spotify.client_id + ':' + this.api_key.spotify.secret)
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

  private async obtainSpotifyName(access_token: string): Promise<string> {
    try {
      const response = await request
        .get(NowSpotify.user_url)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + access_token);
      return response.body.display_name
    }
    catch (e) {
      console.log('[MediaController] error: unable to obtain spotify name.')
    }
    return 'Undefined Account';
  }

  private async obtainDeezerToken(code: string) {
    const response = await request
      .get(NowDeezer.auth_url)
      .query({ app_id: this.api_key.deezer.app_id })
      .query({ secret: this.api_key.deezer.secret })
      .query({ code: code })
      .query({ output: "json" });
    return response.body.access_token;
  }

  private async obtainDeezerName(access_token: string): Promise<string> {
    try {
      const response = await request
        .get(NowDeezer.user_url)
        .query({ access_token: access_token })
        .query({ output: "json" })
      return response.body.name;
    }
    catch (e) {
      console.log('[MediaController] error: unable to obtain deezer name.')
    }
    return 'Undefined Account';
  }
}
