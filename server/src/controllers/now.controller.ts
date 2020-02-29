import { get, param, post, getModelSchemaRef } from '@loopback/rest';
import { inject, BindingScope, bind } from '@loopback/core';
import { repository } from '@loopback/repository';

import { authenticate } from '@loopback/authentication';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';
import { UserProfile, securityId, SecurityBindings } from '@loopback/security';

import { RadiodBindings, RadiodKeys } from '../keys';

import { NowObject } from '../now';
import { MediaCredentials, User, UserPower } from '../models';
import { MediaCredentialsRepository, UserRepository } from '../repositories';
import { PersistentKeyService, NowService } from '../services';

@bind({ scope: BindingScope.SINGLETON })
export class NowController {
  constructor(
    @inject(RadiodBindings.PERSISTENT_KEY_SERVICE) private params: PersistentKeyService,
    @repository(MediaCredentialsRepository) private credentialRepository: MediaCredentialsRepository,
    @repository(UserRepository) private userRepository: UserRepository,
    @inject(RadiodBindings.NOW_SERVICE) private nowService: NowService,
  ) { }

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
    return this.nowService.value();
  }

  @post('/now/set', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Set the default credential succeeed',
      },
    },
  })
  @authenticate({ strategy: 'jwt', options: { power: UserPower.ADMIN } })
  async setMedia(
    @param.query.string('userId') userId: string,
  ) {
    let credential: MediaCredentials | undefined;
    let data: MediaCredentials[] = await this.userRepository.mediaCredentials(userId).find({
      where: {
        scope: 'user-read-playback-state'
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
  @authenticate({ strategy: 'jwt', options: { power: UserPower.ADMIN } })
  async findMedia() {
    let credentials = await this.credentialRepository.find({
      include: [
        {
          relation: 'user',
        },
      ],
      where: {
        scope: 'user-read-playback-state'
      }
    });
    return credentials.map(value => value.user);
  }

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
