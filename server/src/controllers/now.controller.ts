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
import { Credential, Configuration } from '../models';

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
        name = 'Spotify Auth';
        token = await this.obtainSpotifyToken(code);
        break;
      case NowEnum.Deezer: {
        name = 'Deezer Auth';
        token = await this.obtainDeezerToken(code);
        break;
      }
    }
    return this.credentialRepository.create(new Credential({
      name: name,
      type: serviceId,
      token: token
    }));
  }

  private async obtainSpotifyToken(code: string) {
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
        redirect_uri: 'http://' + this.config.domain + ':' + this.config.rest.port + '/now/1/callback'
      });
    return response.body.refresh_token;
  }

  private async obtainDeezerToken(code: string) {
    const response = await request
      .get(NowDeezer.auth_url)
      .query({ app_id: this.apiKey.deezer.app_id })
      .query({ secret: this.apiKey.deezer.secret })
      .query({ code: code })
      .query({ output: "json" });
    return response.body.access_token;
  }

  @get('/now/delete/{id}', {
    responses: {
      '204': {
        description: 'Credential DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.credentialRepository.deleteById(id);
  }
}
