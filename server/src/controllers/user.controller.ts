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

@model()
export class NewUserRequest extends User {
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
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: NewUserRequest): Promise<User> {
    validateCredentials(_.pick(newUserRequest, ['email', 'password']));
    const password = await this.passwordHasher.hashPassword(newUserRequest.password);
    try {
      const savedUser = await this.userRepository.create(_.omit(newUserRequest, 'id', 'password'));
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
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @requestBody(CredentialsRequestBody) credentials: Credentials,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN) maxAge: string): Promise<{ token: string }> {
    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = this.userService.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile);
    response.cookie("RADIO-DIDOU-AUTH", token, {
      path: "/",
      maxAge: Number.parseInt(maxAge) * 1000,
      sameSite: "lax",
      httpOnly: true
    });
    return { token };
  }

  @get('/users/logout', {
    responses: {
      '200': {
        description: 'Logout'
      },
    },
  })
  async logout(
    @inject(RestBindings.Http.RESPONSE) response: Response) {
    response.cookie("RADIO-DIDOU-AUTH", "", {
      path: "/",
      expires: new Date(0)
    });
    return {};
  }
}
