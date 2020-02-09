import { get, param, getModelSchemaRef } from '@loopback/rest';
import { inject, BindingScope, bind } from '@loopback/core';
import { repository } from '@loopback/repository';

import { RadiodBindings, RadiodKeys } from '../keys';

import { NowDeezer, NowSpotify, NowEnum, NowObject } from '../now';
import { NowCredentials } from '../models';
import { NowCredentialsRepository } from '../repositories';
import { PersistentKeyService, NowService } from '../services';

import request = require('superagent');

@bind({ scope: BindingScope.SINGLETON })
export class NowController {
  constructor(
    @inject(RadiodBindings.API_KEY) private api_key: any,
    @inject(RadiodBindings.GLOBAL_CONFIG) private global_config: any,
    @inject(RadiodBindings.PERSISTENT_KEY_SERVICE) private params: PersistentKeyService,
    @repository(NowCredentialsRepository) public credentialRepository: NowCredentialsRepository,
    @inject(RadiodBindings.NOW_SERVICE) private nowService: NowService,
  ) { }

  @get('/now/get', {
    responses: {
      '200': {
        description: 'Informations about the current song',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': NowObject,
            },
          },
        },
      },
    },
  })
  async getNow() {
    return this.nowService.value();
  }

  @get('/now/set/{credentialId}')
  async setNow(
    @param.path.string('credentialId') credentialId: string,
  ) {
    try {
      let credential: NowCredentials = await this.credentialRepository.findById(credentialId);
      await this.params.set(RadiodKeys.DEFAULT_CREDENTIAL, credential.getId());
      this.nowService.setFetcher(credential);
    } catch (e) {
      console.log(e);
    }
  }

  @get('/now/show', {
    responses: {
      '200': {
        description: 'Array of Credential model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(NowCredentials),
            },
          },
        },
      },
    },
  })
  async show(): Promise<NowCredentials[]> {
    return this.credentialRepository.find();
  }

  @get('/now/{serviceId}/callback', {
    responses: {
      '200': {
        description: 'Credential model instance',
        content: { 'application/json': { schema: getModelSchemaRef(NowCredentials) } },
      },
    },
  })
  async create(
    @param.path.number('serviceId') serviceId: number,
    @param.query.string('code') code: string
  ): Promise<NowCredentials> {
    let name: string = '';
    let token: string = '';
    switch (serviceId) {
      case NowEnum.Spotify:
        let tokens = await this.obtainSpotifyToken(code);
        token = tokens.refresh_token;
        name = await this.obtainSpotifyName(tokens.access_token);
        break;
      case NowEnum.Deezer: {
        token = await this.obtainDeezerToken(code);
        name = await this.obtainDeezerName(token);
        break;
      }
    }
    return this.credentialRepository.create(new NowCredentials({
      name: name,
      type: serviceId,
      token: token
    }));
  }

  private async obtainSpotifyToken(code: string): Promise<any> {
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
        redirect_uri: this.global_config.loopback + 'now/1/callback'
      });
    return {
      refresh_token: response.body.refresh_token,
      access_token: response.body.access_token
    }
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
      console.log('[NowController] error: unable to obtain spotify name.')
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
      console.log('[NowController] error: unable to obtain deezer name.')
    }
    return 'Undefined Account';
  }

  @get('/now/delete/{credentialId}', {
    responses: {
      '204': {
        description: 'Credential DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('credentialId') credentialId: string): Promise<void> {
    await this.credentialRepository.deleteById(credentialId);
  }
}
