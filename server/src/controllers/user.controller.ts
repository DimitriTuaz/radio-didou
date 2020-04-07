import { repository, model, property } from '@loopback/repository';
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
import { CookieOptions } from 'express'
import { User, UserPower } from '../models';
import { UserRepository } from '../repositories';
import { JWTService } from '../services';
import { inject, CoreBindings } from '@loopback/core';
import {
  authenticate,
  UserService,
} from '@loopback/authentication';
import { UserProfile, securityId, SecurityBindings } from '@loopback/security';
import { Credentials } from '../repositories/user.repository';
import { PasswordHasher } from '../services/hash.password.bcryptjs';

import {
  PasswordHasherBindings,
  RadiodBindings,
  TokenServiceBindings,
} from '../keys';
import _ from 'lodash';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';
import { logger, LOGGER_LEVEL } from '../logger';

@model()
class NewUser {
  @property({ required: true }) email: string;
  @property({ required: true }) password: string;
  @property({ required: false }) firstName?: string;
  @property({ required: false }) lastName?: string;
}

@model()
class LoginCredentials {
  @property({ required: true }) email: string;
  @property({ required: true }) password: string;
}

export class UserController {
  constructor(
    @repository(UserRepository) private userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER) private passwordHasher: PasswordHasher,
    @inject(TokenServiceBindings.TOKEN_SERVICE) private jwtService: JWTService,
    @inject(RadiodBindings.USER_SERVICE) private userService: UserService<User, Credentials>,
    @inject(CoreBindings.APPLICATION_CONFIG) private global_config: any
  ) { }

  /**
  ** Register a new user
  **/
  @post('/user/register', {
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
  @logger(LOGGER_LEVEL.INFO)
  async register(
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
      const savedUser = await this.userRepository.create(_.omit(newUser, 'password'));
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

  /**
  ** Get user info from userID
  **/
  @get('/user/{userId}', {
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

  /**
  ** Get the current user
  **/
  @get('/user/me', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'The current user profile',
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
  @authenticate({ strategy: 'jwt', options: { power: UserPower.NONE } })
  async currentUser(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile): Promise<UserProfile> {
    currentUserProfile.id = currentUserProfile[securityId];
    delete currentUserProfile[securityId];
    return currentUserProfile;
  }

  /**
  ** Grant a token embedded in a cookie
  **/
  @post('/user/login', {
    responses: {
      '204': {
        description: 'Grant token in a cookie',
        headers: {
          'Set-Cookie': {
            description: 'Access token valid for 48 hours',
            schema: {
              type: 'string',
            }
          }
        }
      },
    },
  })
  @logger(LOGGER_LEVEL.INFO)
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LoginCredentials)
        },
      },
    }) credentials: Credentials,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN) maxAge: string): Promise<void> {
    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = this.userService.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile, user.power);
    let options: CookieOptions = {
      path: "/",
      maxAge: Number.parseInt(maxAge) * 1000,
      sameSite: "lax",
      httpOnly: true
    };
    if ('domain' in this.global_config) {
      options.domain = this.global_config.domain;
    }
    response.cookie("RADIO-DIDOU-AUTH", token, options);
  }

  /**
  ** Revoke the cookie
  **/
  @post('/user/logout', {
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
  @logger(LOGGER_LEVEL.INFO)
  async logout(
    @inject(RestBindings.Http.RESPONSE) response: Response): Promise<void> {
    let options: CookieOptions = {
      path: "/",
      expires: new Date(0)
    };
    if ('domain' in this.global_config) {
      options.domain = this.global_config.domain;
    }
    response.cookie("RADIO-DIDOU-AUTH", "", options);
  }
}
