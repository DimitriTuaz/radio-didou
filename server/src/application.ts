import { BootMixin } from '@loopback/boot';
import { RepositoryMixin } from '@loopback/repository';
import { BindingScope, CoreBindings } from '@loopback/core';
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
  PasswordHasherBindings,
} from './keys';

import {
  PersistentKeyService,
  JWTService,
  BcryptHasher,
  MainUserService
} from './services';

import { LoggingComponent, LoggingBindings, LOGGER_LEVEL } from './logger';
import { transports, format } from 'winston';
import { NowComponent } from './now/now.component';

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
    this.setupLogging();
    this.component(LoggingComponent);
    // NOW
    this.component(NowComponent);
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

    this.bind(RadiodBindings.PERSISTENT_KEY_SERVICE)
      .toClass(PersistentKeyService)
      .inScope(BindingScope.SINGLETON);

    this.bind(RadiodBindings.USER_SERVICE).toClass(MainUserService);

    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(this.config.jwt.secret);
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(this.config.jwt.expires);

    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);
  }

  private setupLogging(): void {
    let directory: string;
    if (this.config.logger.directory !== undefined)
      directory = this.config.logger.directory;
    else
      directory = path.join(this.rootPath, 'logs');

    this.configure(LoggingBindings.LOGGER).to({
      transports: [
        new transports.Console({
          level: this.config.logger.level,
          format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.printf(info => {
              let message = `<${info.level.toUpperCase()}> - [${info.timestamp}]: ${info.message}`
              if (info.error !== undefined && this.config.logger.stack_trace)
                message += `\n${info.error}`;
              return message;
            })
          )
        }),
        new transports.File({
          dirname: directory,
          filename: 'error.log',
          level: LOGGER_LEVEL.ERROR,
          format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.printf(info => `[${info.timestamp}]: ${info.message}\n${info.error}\n`),
          )
        })
      ]
    });
  }
}
