// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { inject } from '@loopback/context';
import { HttpErrors, Request } from '@loopback/rest';
import { AuthenticationStrategy, AuthenticationBindings, AuthenticationMetadata } from '@loopback/authentication';
import { UserProfile } from '@loopback/security';
import { TokenServiceBindings } from '../keys';
import { JWTService } from '../services';
import { UserPower } from '../models';

import { parse } from 'cookie';

export class JWTAuthenticationStrategy implements AuthenticationStrategy {
  name = 'jwt';

  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE) public tokenService: JWTService,
    @inject(AuthenticationBindings.METADATA) private metadata: AuthenticationMetadata,
  ) { }

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    let userPower: UserPower | undefined = undefined;
    const token: string = this.extractCredentials(request);
    if (this.metadata.options !== undefined)
      userPower = this.metadata.options.power;
    const userProfile: UserProfile = await this.tokenService.verifyToken(token, userPower);
    return userProfile;
  }

  extractCredentials(request: Request): string {
    if (!request.headers.cookie) {
      throw new HttpErrors.Unauthorized(`Cookie not found`);
    }
    let cookies = parse(request.headers.cookie)
    if (!('RADIO-DIDOU-AUTH' in cookies)) {
      throw new HttpErrors.Unauthorized(`RADIO-DIDOU-AUTH key not found in cookie.`);
    }
    return cookies['RADIO-DIDOU-AUTH'];
  }
}
