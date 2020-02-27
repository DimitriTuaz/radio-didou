import { get, param, post } from '@loopback/rest';
import { inject, BindingScope, bind } from '@loopback/core';
import { repository } from '@loopback/repository';

import { authenticate } from '@loopback/authentication';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';
import { UserProfile, securityId, SecurityBindings } from '@loopback/security';

import { RadiodBindings, RadiodKeys } from '../keys';

import { NowObject } from '../now';
import { MediaCredentials } from '../models';
import { MediaCredentialsRepository } from '../repositories';
import { PersistentKeyService, NowService } from '../services';

@bind({ scope: BindingScope.SINGLETON })
export class NowController {
  constructor(
    @inject(RadiodBindings.PERSISTENT_KEY_SERVICE) private params: PersistentKeyService,
    @repository(MediaCredentialsRepository) private credentialRepository: MediaCredentialsRepository,
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

  @post('/now/set/{credentialId}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Set the default credential succeeed',
      },
    },
  })
  @authenticate('jwt')
  async setMedia(
    @param.path.string('credentialId') credentialId: string,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile): Promise<void> {
    try {
      let userId: string = currentUserProfile[securityId];
      let credential: MediaCredentials = await this.credentialRepository.findById(credentialId);
      await this.params.set(RadiodKeys.DEFAULT_CREDENTIAL, credential.getId());
      this.nowService.setFetcher(credential);
    } catch (e) {
      console.log(e);
    }
  }
}
