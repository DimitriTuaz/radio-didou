import { get, param, getModelSchemaRef, getFilterSchemaFor, post, requestBody, del } from '@loopback/rest';
import { inject, Binding, BindingScope, Getter } from '@loopback/core';

import { RadiodBindings } from '../keys';

import { NowService } from '../services/now.service';
import { NowDeezer } from '../now/now.deezer';
import { NowSpotify } from '../now/now.spotify';
import { NowNone } from '../now/now.none';

import { NowEnum } from '@common/now/now.common';
import { Filter, repository } from '@loopback/repository';

import { CredentialRepository } from '../repositories/credential.repository';
import { Credential } from '../models/credential.model';

export class NowController {
  constructor(
    @repository(CredentialRepository) public credentialRepository: CredentialRepository,
    @inject.getter(RadiodBindings.NOW_SERVICE) private serviceGetter: Getter<NowService>,
    @inject.binding(RadiodBindings.NOW_SERVICE) private serviceBinding: Binding<NowService>
  ) { }

  @get('/now/get')
  async getNow() {
    const service = await this.serviceGetter();
    return service.value();
  }

  @get('/now/set/{serviceId}')
  async setNowService(
    @param.path.number('serviceId') serviceId: number,
  ) {
    let service = await this.serviceGetter();
    let value = service.value();
    service.stop();
    switch (serviceId) {
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
    service.start(value);
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
    let credential: Credential = new Credential({
      name: 'paeolo',
      type: serviceId,
      token: code
    });
    return this.credentialRepository.create(credential);
  }

  @del('/now/delete/{id}', {
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
