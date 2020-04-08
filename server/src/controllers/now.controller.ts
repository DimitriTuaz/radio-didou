import {
  get,
  post,
  getModelSchemaRef,
  requestBody
} from '@loopback/rest';
import { inject, BindingScope, bind, Getter } from '@loopback/core';
import { repository } from '@loopback/repository';
import { authenticate } from '@loopback/authentication';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';

import { RadiodBindings, RadiodKeys } from '../keys';
import {
  NowObject,
  SpotifyScope,
  NowBindings,
  NowService,
  NowEnum,
  NowState
} from '../now';
import { MediaCredentials, User, UserPower } from '../models';
import { MediaCredentialsRepository, UserRepository } from '../repositories';
import { PersistentKeyService } from '../services';
import { logger, LOGGER_LEVEL } from '../logger';

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
  ** Get informations about the current song.
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
  ** Get the state of NowService
  **/
  @get('/now/getState', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Return the state of NowService',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': NowState,
            },
          },
        },
      },
    },
  })
  @logger(LOGGER_LEVEL.INFO)
  @authenticate({ strategy: 'jwt', options: { power: UserPower.ADMIN } })
  async getState(
    @inject(NowBindings.NOW_STATE, { optional: true }) state: NowState | undefined) {
    return state !== undefined ? state : { type: NowEnum.None };
  }

  /**
  ** Set the state of NowService
  **/
  @post('/now/setState', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Set the state of NowService',
      },
    },
  })
  @logger(LOGGER_LEVEL.INFO)
  @authenticate({ strategy: 'jwt', options: { power: UserPower.ADMIN } })
  async setState(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NowState)
        },
      },
    }) state: NowState) {
    let credential: MediaCredentials | undefined = undefined;
    if (state.userId !== undefined) {
      let data: MediaCredentials[] = await this.userRepository.mediaCredentials(state.userId).find({
        where: {
          scope: SpotifyScope.playback
        }
      });
      if (data.length > 0) {
        credential = data[0];
        await this.params.set(RadiodKeys.DEFAULT_CREDENTIAL, credential.getId());
      }
    }
    else if (state.type !== NowEnum.Live) {
      await this.params.set(RadiodKeys.DEFAULT_CREDENTIAL, NowEnum.None.toString());
    }
    this.nowService.setFetcher(state, credential);
  }

  /**
  ** Set the state of NowService to the default state
  **/
  @post('/now/setDefaultState', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Set the state of NowService to the default state',
      },
    },
  })
  @logger(LOGGER_LEVEL.INFO)
  @authenticate({ strategy: 'jwt', options: { power: UserPower.ADMIN } })
  async setDefaultState() {
    this.nowService.setDefaultFetcher();
  }

  /**
  ** Get an array with all the available credentials.
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
}
