import { get, param, getModelSchemaRef, getFilterSchemaFor } from '@loopback/rest';
import { inject, Binding, BindingScope, Getter, bind, service } from '@loopback/core';

import { RadiodBindings, RadiodKeys } from '../keys';

import { NowService } from '../services/now.service';
import { NowDeezer } from '../now/now.deezer';
import { NowSpotify } from '../now/now.spotify';
import { NowNone } from '../now/now.none';

import { NowEnum } from '@common/now/now.common';
import { Filter, repository } from '@loopback/repository';

import { CredentialRepository } from '../repositories';
import { ConfigurationService } from '../services';
import { Credential } from '../models';

import request = require('superagent');

@bind({ scope: BindingScope.SINGLETON })
export class NowController {
  constructor(
    @inject(RadiodBindings.API_KEY) private apiKey: any,
    @inject(RadiodBindings.CONFIG) private config: any,
    @inject(RadiodBindings.CONFIG_SERVICE) private configuration: ConfigurationService,
    @repository(CredentialRepository) public credentialRepository: CredentialRepository,
    @inject.getter(RadiodBindings.NOW_SERVICE) private serviceGetter: Getter<NowService>,
    @inject.binding(RadiodBindings.NOW_SERVICE) private serviceBinding: Binding<NowService>
  ) { }

  @get('/now/get')
  async getNow() {
    const service = await this.serviceGetter();
    return service.value();
  }

  @get('/now/set/{credentialId}')
  async setNowService(
    @param.path.string('credentialId') credentialId: string,
  ) {
    try {
      let credential: Credential = await this.credentialRepository.findById(credentialId);
      await this.configuration.set(RadiodKeys.DEFAULT_CREDENTIAL, credential.getId());
      let service = await this.serviceGetter();
      let value = service.value();
      service.stop();
      switch (credential.type) {
        case NowEnum.Spotify:
          this.serviceBinding.toClass(NowSpotify).inScope(BindingScope.SINGLETON);
          break;
        case NowEnum.Deezer:
          this.serviceBinding.toClass(NowDeezer).inScope(BindingScope.SINGLETON);
          break;
        default:
          this.serviceBinding.toClass(NowNone).inScope(BindingScope.SINGLETON);
      }
      service = await this.serviceGetter();
      service.start(value, credential.token);
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
              items: getModelSchemaRef(Credential, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Credential)) filter?: Filter<Credential>,
  ): Promise<Credential[]> {
    return this.credentialRepository.find(filter);
  }

  @get('/now/{serviceId}/callback', {
    responses: {
      '200': {
        description: 'Credential model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Credential) } },
      },
    },
  })
  async create(
    @param.path.number('serviceId') serviceId: number,
    @param.query.string('code') code: string
  ): Promise<Credential> {
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
    return this.credentialRepository.create(new Credential({
      name: name,
      type: serviceId,
      token: token
    }));
  }

  private async obtainSpotifyToken(code: string): Promise<any> {
    const authorization = Buffer.from(this.apiKey.spotify.client_id + ':' + this.apiKey.spotify.secret)
      .toString('base64');
    const response = await request
      .post(NowSpotify.token_url)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', 'Basic ' + authorization)
      .send({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.config.loopback + 'now/1/callback'
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
      .query({ app_id: this.apiKey.deezer.app_id })
      .query({ secret: this.apiKey.deezer.secret })
      .query({ code: code })
      .query({ output: "json" });
    console.log(response.body)
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
