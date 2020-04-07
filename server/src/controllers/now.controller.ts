import { get, param, post, getModelSchemaRef } from '@loopback/rest';
import { inject, BindingScope, bind, Getter } from '@loopback/core';
import { repository, model, property } from '@loopback/repository';
import { authenticate } from '@loopback/authentication';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';

import { RadiodBindings, RadiodKeys } from '../keys';
import { NowObject, SpotifyScope, NowBindings, NowService, NowEnum } from '../now';
import { MediaCredentials, User, UserPower } from '../models';
import { MediaCredentialsRepository, UserRepository } from '../repositories';
import { PersistentKeyService } from '../services';
import { logger, LOGGER_LEVEL } from '../logger'

@model()
class NowInfo {
  @property({ required: true, type: 'number' }) type: NowEnum;
  @property({ required: false }) userId: string;
}

@bind({ scope: BindingScope.SINGLETON })
export class NowController {
  constructor(
    @inject(RadiodBindings.PERSISTENT_KEY_SERVICE) private params: PersistentKeyService,
    @repository(MediaCredentialsRepository) private credentialRepository: MediaCredentialsRepository,
    @repository(UserRepository) private userRepository: UserRepository,
    @inject(NowBindings.NOW_SERVICE) private nowService: NowService,
    @inject.getter(NowBindings.CURRENT_NOW) private nowGetter: Getter<NowObject>
  ) { }

  /**
  ** Return informations about the current song
  **/
  @get('/now/get', {
    responses: {
      '200': {
        description: 'Return informations about the current song',
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
    return await this.nowGetter();
  }

  /**
  ** Set the default credential
  **/
  @post('/now/set', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Set the default credential succeeed',
      },
    },
  })
  @logger(LOGGER_LEVEL.INFO)
  @authenticate({ strategy: 'jwt', options: { power: UserPower.ADMIN } })
  async setMedia(
    @param.query.number('type') type: NowEnum,
    @param.query.string('userId') userId: string,
  ) {
    let credential: MediaCredentials | undefined;
    let data: MediaCredentials[] = await this.userRepository.mediaCredentials(userId).find({
      where: {
        scope: SpotifyScope.playback
      }
    });
    if (data.length > 0) {
      credential = data[0];
      await this.params.set(RadiodKeys.DEFAULT_CREDENTIAL, credential.getId());
    }
    else {
      credential = undefined;
      await this.params.set(RadiodKeys.DEFAULT_CREDENTIAL, 'none');
    }
    this.nowService.setFetcher(credential);
  }

  /**
  ** Return an array with all the available credentials
  **/
  @get('/now/find', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Return an array of users with a Spotify account.',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(User),
            },
          },
        },
      },
    },
  })
  @logger(LOGGER_LEVEL.INFO)
  @authenticate({ strategy: 'jwt', options: { power: UserPower.ADMIN } })
  async findMedia() {
    let credentials = await this.credentialRepository.find({
      include: [
        {
          relation: 'user',
        },
      ],
      where: {
        scope: SpotifyScope.playback
      }
    });
    return credentials.map(value => value.user);
  }

  /**
  ** Return an array with the selected credential
  **/
  @get('/now/who', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Return the selected user for displaying the current track',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(User),
            },
          },
        },
      },
    },
  })
  @logger(LOGGER_LEVEL.INFO)
  @authenticate({ strategy: 'jwt', options: { power: UserPower.ADMIN } })
  async getMedia() {
    let crendentialID: string = await this.params.get(RadiodKeys.DEFAULT_CREDENTIAL);
    let credentials = await this.credentialRepository.find({
      include: [
        {
          relation: 'user',
        },
      ],
      where: {
        id: crendentialID
      }
    });
    return credentials.map(value => value.user);
  }
}
