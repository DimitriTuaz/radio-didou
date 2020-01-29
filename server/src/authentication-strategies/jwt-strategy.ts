// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { inject } from '@loopback/context';
import { HttpErrors, Request } from '@loopback/rest';
import { AuthenticationStrategy, TokenService } from '@loopback/authentication';
import { UserProfile } from '@loopback/security';
import { RadiodBindings } from '../keys';

import { parse } from 'cookie';

export class JWTAuthenticationStrategy implements AuthenticationStrategy {
  name = 'jwt';

  constructor(
    @inject(RadiodBindings.TOKEN_SERVICE)
    public tokenService: TokenService,
  ) { }

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token: string = this.extractCredentials(request);
    const userProfile: UserProfile = await this.tokenService.verifyToken(token);
    return userProfile;
  }

  extractCredentials(request: Request): string {
    if (!request.headers.cookie) {
      throw new HttpErrors.Unauthorized(`Cookie not found`);
    }
    let cookies = parse(request.headers.cookie)
    if (!('token' in cookies)) {
      throw new HttpErrors.Unauthorized(`Token key not found in cookie.`);
    }
    return cookies['token'];
  }
}
