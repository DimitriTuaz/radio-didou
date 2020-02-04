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
import { RadiodBindings, TokenServiceBindings, PasswordHasherBindings } from './keys';

import { PersistentKeyService, NowService, JWTService, BcryptHasher, MainUserService } from './services';
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

    this.bind(RadiodBindings.PERSISTENT_KEY_SERVICE)
      .toClass(PersistentKeyService)
      .inScope(BindingScope.SINGLETON);

    this.bind(RadiodBindings.TOKEN_SERVICE).toClass(JWTService);
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(this.config.secret);
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to('43200');
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);

    this.bind(RadiodBindings.USER_SERVICE).toClass(MainUserService);

    this.bind(RadiodBindings.NOW_SERVICE)
      .toClass(NowService)
      .tag(CoreTags.LIFE_CYCLE_OBSERVER)
      .inScope(BindingScope.SINGLETON);
  }

  public async init(): Promise<void> {
    let nowService: NowService = await this.get(RadiodBindings.NOW_SERVICE);
    await nowService.setDefaultFetcher();
  }
}
