// Copyright IBM Corp. 2018,2019. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { repository, model, property, RepositoryMixin } from '@loopback/repository';
import { validateCredentials } from '../services/validator';
import {
  post,
  param,
  get,
  requestBody,
  HttpErrors,
  getModelSchemaRef,
  RestBindings,
  Response,
} from '@loopback/rest';
import { User } from '../models';
import { UserRepository } from '../repositories';
import { inject } from '@loopback/core';
import {
  authenticate,
  TokenService,
  UserService,
} from '@loopback/authentication';
import { UserProfile, securityId, SecurityBindings } from '@loopback/security';
import {
  CredentialsRequestBody,
  UserProfileSchema,
} from './specs/user-controller.specs';
import { Credentials } from '../repositories/user.repository';
import { PasswordHasher } from '../services/hash.password.bcryptjs';

import {
  PasswordHasherBindings,
  RadiodBindings,
  TokenServiceBindings,
} from '../keys';
import _ from 'lodash';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';

export class NewUser extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

export class UserController {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject(RadiodBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(RadiodBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>,
  ) { }

  @post('/users/register', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUser)
        },
      },
    })
    newUser: NewUser): Promise<User> {
    validateCredentials(_.pick(newUser, ['email', 'password']));
    const password = await this.passwordHasher.hashPassword(newUser.password);
    try {
      const savedUser = await this.userRepository.create(_.omit(newUser, 'id', 'password'));
      await this.userRepository.userCredentials(savedUser.id).create({ password });
      return savedUser;

    } catch (error) {
      if (error.code === 11000 && error.errmsg.includes('index: uniqueEmail')) {
        throw new HttpErrors.Conflict('Email value is already taken');
      } else {
        throw error;
      }
    }
  }

  @get('/users/{userId}', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async findById(@param.path.string('userId') userId: string): Promise<User> {
    return this.userRepository.findById(userId);
  }

  @get('/users/me', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: UserProfileSchema,
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async printCurrentUser(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile): Promise<UserProfile> {
    currentUserProfile.id = currentUserProfile[securityId];
    delete currentUserProfile[securityId];
    return currentUserProfile;
  }

  @post('/users/login', {
    responses: {
      '204': {
        description: 'Grant token in a cookie',
        headers: {
          'Set-Cookie': {
            description: 'Access token valid for 12 hours',
            schema: {
              type: 'string',
            }
          }
        }
      },
    },
  })
  async login(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @requestBody(CredentialsRequestBody) credentials: Credentials,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN) maxAge: string): Promise<void> {
    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = this.userService.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile);
    response.cookie("RADIO-DIDOU-AUTH", token, {
      path: "/",
      maxAge: Number.parseInt(maxAge) * 1000,
      sameSite: "lax",
      httpOnly: true
    });
  }

  @post('/users/logout', {
    responses: {
      '204': {
        description: 'Revoke the token',
        headers: {
          'Set-Cookie': {
            description: 'Expire the token cookie.',
            schema: {
              type: 'string',
            }
          }
        }
      },
    },
  })
  async logout(
    @inject(RestBindings.Http.RESPONSE) response: Response): Promise<void> {
    response.cookie("RADIO-DIDOU-AUTH", "", {
      path: "/",
      expires: new Date(0)
    });
  }
}
