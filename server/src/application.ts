import { BootMixin } from '@loopback/boot';
import { RepositoryMixin } from '@loopback/repository';
import { BindingScope, CoreTags, CoreBindings } from '@loopback/core';
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

import { PersistentKeyService, NowService, JWTService, BcryptHasher, MainUserService } from './services';
import { NowCredentialsRepository } from './repositories';
import { NowCredentials } from './models'
import { SECURITY_SCHEME_SPEC } from './utils/security-spec';

export class RadiodApplication extends BootMixin(RepositoryMixin(RestApplication)) {

  private rootPath: string;
  private config: any;

  constructor() {

    super();
    this.rootPath = path.join(__dirname, '../..');
    this.config = JSON.parse(fs.readFileSync(path.join(this.rootPath, 'config.json')).toString());

    this.bind(CoreBindings.APPLICATION_CONFIG).to({
      rest: {
        host: this.config.rest.host,
        port: this.config.rest.port
      }
    });

    this.api({
      openapi: '3.0.0',
      info: { title: "Radiod", version: "0.0.1" },
      paths: {},
      components: { securitySchemes: SECURITY_SCHEME_SPEC },
      servers: [{ url: '/' }],
    });

    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    this.projectRoot = __dirname;

    this.sequence(MainSequence);
    this.bind(RestExplorerBindings.CONFIG).to({ path: '/explorer' });
    this.component(RestExplorerComponent);
    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, JWTAuthenticationStrategy);

    this.static('/', path.join(this.rootPath, 'client/build'));
    this.static('/jingles', path.join(this.rootPath, 'client/build'));

    this.setupBindings();
  }

  private setupBindings(): void {

    this.bind(RadiodBindings.ROOT_PATH).to(this.rootPath);
    this.bind(RadiodBindings.GLOBAL_CONFIG).to(this.config)
    this.bind(RadiodBindings.MONGO_CONFIG)
      .to(JSON.parse(fs.readFileSync(path.join(this.rootPath, 'mongo.config.json')).toString()));

    this.bind(RadiodBindings.API_KEY)
      .to(JSON.parse(fs.readFileSync(path.join(this.rootPath, 'api_key.json')).toString()));

    this.bind(RadiodBindings.CONFIG_SERVICE)
      .toClass(PersistentKeyService)
      .inScope(BindingScope.SINGLETON);

    this.bind(RadiodBindings.TOKEN_SERVICE).toClass(JWTService);
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(TokenServiceConstants.TOKEN_SECRET_VALUE);
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE);
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);

    this.bind(RadiodBindings.USER_SERVICE).toClass(MainUserService);
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
