import { BootMixin } from '@loopback/boot';
import { RepositoryMixin } from '@loopback/repository';
import { BindingScope, CoreTags, CoreBindings, extensionFor } from '@loopback/core';
import { RestExplorerBindings, RestExplorerComponent } from '@loopback/rest-explorer';
import {
  AuthenticationComponent,
  registerAuthenticationStrategy
} from '@loopback/authentication'
import { JWTAuthenticationStrategy } from './authentication/jwt-strategy';
import { SECURITY_SCHEME_SPEC } from './utils/security-spec';
import { RestApplication } from '@loopback/rest';

import path from 'path';
import fs from 'fs';
import YAML from 'yaml';

import { MainSequence } from './sequence';

import {
  RadiodBindings,
  TokenServiceBindings,
  PasswordHasherBindings
} from './keys';

import {
  PersistentKeyService,
  NowService,
  JWTService,
  BcryptHasher,
  MainUserService
} from './services';

import { LoggingComponent } from './logger';
import { NowNone } from './now';

export class RadiodApplication extends BootMixin(RepositoryMixin(RestApplication)) {

  private rootPath: string;
  private config: any;

  constructor() {
    super();
    this.rootPath = path.join(__dirname, '../..');
    this.config = YAML.parse(fs.readFileSync(path.join(this.rootPath, 'config.yaml')).toString());

    this.bind(CoreBindings.APPLICATION_CONFIG).to(this.config);

    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    this.projectRoot = __dirname;
    this.sequence(MainSequence);

    this.setupComponents();
    this.setupStaticBindings();
    this.setupBindings();
  }

  private setupComponents(): void {
    // OPENAPI
    this.api({
      openapi: '3.0.0',
      info: { title: "Radiod", version: "0.0.1" },
      paths: {},
      components: { securitySchemes: SECURITY_SCHEME_SPEC },
      servers: [{ url: '/' }],
    });
    this.component(RestExplorerComponent);
    this.bind(RestExplorerBindings.CONFIG).to({ path: '/explorer' });

    // AUTHENTICATION
    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, JWTAuthenticationStrategy);
    // LOGGER
    this.component(LoggingComponent);
  }

  private setupStaticBindings(): void {
    // MAIN
    this.static('/', path.join(this.rootPath, 'client/build'));
    this.static('/jingles', path.join(this.rootPath, 'client/build'));
    this.static('/close', path.join(this.rootPath, 'static/close.html'));

    // [EXPERIMENTAL] LOW LATENCY
    this.static('/lowlatency', path.join(this.rootPath, 'static/lowlatency.html'));
    this.static('/janus.min.js', path.join(this.rootPath, 'static/janus.min.js'));
    this.static('/lowlatency.js', path.join(this.rootPath, 'static/lowlatency.js'));
  }

  private setupBindings(): void {

    this.bind(RadiodBindings.ROOT_PATH).to(this.rootPath);
    this.bind(RadiodBindings.MONGO_CONFIG).to(this.config.datasource);
    this.bind(RadiodBindings.PERSISTENT_KEY_SERVICE)
      .toClass(PersistentKeyService)
      .inScope(BindingScope.SINGLETON);

    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(this.config.jwt.secret);
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(this.config.jwt.expires);

    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);

    this.bind(RadiodBindings.USER_SERVICE).toClass(MainUserService);

    this.bind(RadiodBindings.NOW_FETCHER)
      .toClass(NowNone)
      .inScope(BindingScope.SINGLETON);
    this.bind(RadiodBindings.NOW_OBJECT)
      .toProvider(NowService)
      .tag(CoreTags.LIFE_CYCLE_OBSERVER)
      .inScope(BindingScope.SINGLETON);
  }
}
