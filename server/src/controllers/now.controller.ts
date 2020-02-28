import { get, param, post, getModelSchemaRef, HttpErrors } from '@loopback/rest';
import { inject, BindingScope, bind } from '@loopback/core';
import { repository } from '@loopback/repository';

import { authenticate } from '@loopback/authentication';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';
import { UserProfile, securityId, SecurityBindings } from '@loopback/security';

import { RadiodBindings, RadiodKeys } from '../keys';

import { NowObject } from '../now';
import { MediaCredentials, User } from '../models';
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

  @post('/now/set', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Set the default credential succeeed',
      },
    },
  })
  @authenticate('jwt')
  async setMedia(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @param.query.string('userId') userId: string,
  ): Promise<void> {
    let credential: MediaCredentials | undefined;
    let credentials: MediaCredentials[] = await this.userRepository.mediaCredentials(userId).find({
      where: {
        scope: 'user-read-playback-state'
      }
    });
    if (credentials.length > 0) {
      credential = credentials[0];
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
        description: 'Array of User model instances',
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
  @authenticate('jwt')
  async findMedia(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile
  ) {
    let userId: string = currentUserProfile[securityId];
    let credentials = await this.credentialRepository.find({
      include: [
        {
          relation: 'user',
        },
      ],
      where: {
        scope: 'user-read-playback-state'
      },
      fields: {

      }
    });
    return credentials.map(value => value.user);
  }
}
