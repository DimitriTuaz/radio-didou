import { BootMixin } from '@loopback/boot';
import { RepositoryMixin } from '@loopback/repository';
import { BindingScope, CoreTags } from '@loopback/core';
import { RestExplorerBindings, RestExplorerComponent } from '@loopback/rest-explorer';
import { AuthenticationComponent, registerAuthenticationStrategy } from '@loopback/authentication'
import { JWTAuthenticationStrategy } from './authentication-strategies/jwt-strategy';
import { RestApplication } from '@loopback/rest';


import path from 'path';
import fs from 'fs';

import { MainSequence } from './sequence';
import { RadiodBindings, RadiodKeys, TokenServiceBindings, TokenServiceConstants, PasswordHasherBindings } from './keys';

import { NowEnum } from '@common/now/now.common';
import { NowNone } from './now/now.none';
import { NowSpotify } from './now/now.spotify';
import { NowDeezer } from './now/now.deezer';

import { ConfigurationService, NowService, JWTService, BcryptHasher, MyUserService } from './services';
import { NowCredentialsRepository } from './repositories';
import { NowCredentials } from './models'
import { SECURITY_SCHEME_SPEC } from './utils/security-spec';

export class RadiodApplication extends BootMixin(RepositoryMixin(RestApplication)) {

  constructor(rootPath: string) {
    let config: any = JSON.parse(fs.readFileSync(path.join(rootPath, 'config.json')).toString());
    super({
      rest: {
        host: config.rest.host,
        port: config.rest.port
      }
    });

    this.api({
      openapi: '3.0.0',
      info: { title: "Radiod", version: "0.0.1" },
      paths: {},
      components: { securitySchemes: SECURITY_SCHEME_SPEC },
      servers: [{ url: '/' }],
    });

    this.projectRoot = __dirname;
    this.sequence(MainSequence);
    this.bind(RestExplorerBindings.CONFIG).to({ path: '/explorer' });
    this.component(RestExplorerComponent);
    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, JWTAuthenticationStrategy);
    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    this.static('/', path.join(rootPath, 'client/build'));
    this.static('/jingles', path.join(rootPath, 'client/build'));

    this.static('/lowlatency', path.join(rootPath, 'static/lowlatency.html'));
    this.static('/janus.min.js', path.join(rootPath, 'static/janus.min.js'));
    this.static('/lowlatency.js', path.join(rootPath, 'static/lowlatency.js'));

    this.bind(RadiodBindings.ROOT_PATH).to(rootPath);
    this.bind(RadiodBindings.GLOBAL_CONFIG).to(config)
    this.bind(RadiodBindings.MONGO_CONFIG)
      .to(JSON.parse(fs.readFileSync(path.join(rootPath, 'mongo.config.json')).toString()));
    this.bind(RadiodBindings.API_KEY)
      .to(JSON.parse(fs.readFileSync(path.join(rootPath, 'api_key.json')).toString()));
    this.bind(RadiodBindings.CONFIG_SERVICE)
      .toClass(ConfigurationService)
      .inScope(BindingScope.SINGLETON);
    // TOKEN Service
    this.bind(RadiodBindings.TOKEN_SERVICE).toClass(JWTService);
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(TokenServiceConstants.TOKEN_SECRET_VALUE);
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE);
    // HASH Service
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);
    // USER Service
    this.bind(RadiodBindings.USER_SERVICE).toClass(MyUserService);
  }

  public async init() {
    let config = await this.get(RadiodBindings.CONFIG_SERVICE);
    let repository: NowCredentialsRepository = await this.getRepository(NowCredentialsRepository);
    try {
      let crendentialID: string = await config.get(RadiodKeys.DEFAULT_CREDENTIAL);
      let credential: NowCredentials = await repository.findById(crendentialID);
      switch (credential.type) {
        case NowEnum.Spotify:
          this.bind(RadiodBindings.NOW_SERVICE).toClass(NowSpotify)
            .inScope(BindingScope.SINGLETON);
          break;
        case NowEnum.Deezer:
          this.bind(RadiodBindings.NOW_SERVICE).toClass(NowDeezer)
            .inScope(BindingScope.SINGLETON);
          break;
      }
      let service: NowService = await this.get(RadiodBindings.NOW_SERVICE);
      service.start(undefined, credential.token);
    }
    catch (e) {
      this.bind(RadiodBindings.NOW_SERVICE)
        .toClass(NowNone)
        .tag(CoreTags.LIFE_CYCLE_OBSERVER)
        .inScope(BindingScope.SINGLETON);
    }
  }
}
