import { BootMixin } from '@loopback/boot';
import { RepositoryMixin } from '@loopback/repository';
import { BindingScope, CoreTags } from '@loopback/core';
import { RestExplorerBindings, RestExplorerComponent } from '@loopback/rest-explorer';
import { RestApplication } from '@loopback/rest';

import path from 'path';
import fs from 'fs';

import { MainSequence } from './sequence';
import { RadiodBindings, RadiodKeys } from './keys';

import { NowEnum } from '@common/now/now.common';
import { NowNone } from './now/now.none';
import { NowSpotify } from './now/now.spotify';
import { NowDeezer } from './now/now.deezer';

import { ConfigurationService, NowService } from './services';
import { CredentialRepository } from './repositories';
import { Credential } from './models'

export class RadiodApplication extends BootMixin(RepositoryMixin(RestApplication)) {

  constructor(rootPath: string) {
    /* SERVER CONFIG */
    let config: any = JSON.parse(fs.readFileSync(path.join(rootPath, 'config.json')).toString());
    super({
      rest: {
        host: config.rest.host,
        port: config.rest.port
      }
    });

    /* LOOPBACK BINDING */
    this.projectRoot = __dirname;
    this.sequence(MainSequence);
    this.bind(RestExplorerBindings.CONFIG).to({ path: '/explorer' });
    this.component(RestExplorerComponent);
    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    /* STATIC BINDING */
    this.static('/', path.join(rootPath, 'client/build'));
    this.static('/jingles', path.join(rootPath, 'client/build'));

    /* APPLICATION BINDING */
    this.bind(RadiodBindings.ROOT_PATH).to(rootPath);
    this.bind(RadiodBindings.GLOBAL_CONFIG).to(config)
    this.bind(RadiodBindings.MONGO_CONFIG)
      .to(JSON.parse(fs.readFileSync(path.join(rootPath, 'mongo.config.json')).toString()));
    this.bind(RadiodBindings.API_KEY)
      .to(JSON.parse(fs.readFileSync(path.join(rootPath, 'api_key.json')).toString()));
    this.bind(RadiodBindings.CONFIG_SERVICE)
      .toClass(ConfigurationService)
      .inScope(BindingScope.SINGLETON);
  }

  public async init() {
    /* INIT NOW SERVICE */
    let config = await this.get(RadiodBindings.CONFIG_SERVICE);
    let repository: CredentialRepository = await this.getRepository(CredentialRepository);
    try {
      let crendentialID: string = await config.get(RadiodKeys.DEFAULT_CREDENTIAL);
      let credential: Credential = await repository.findById(crendentialID);
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
