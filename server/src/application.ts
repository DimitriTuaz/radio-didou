import { BootMixin } from '@loopback/boot';
import { BindingScope, CoreTags } from '@loopback/core';
import { RestExplorerBindings, RestExplorerComponent } from '@loopback/rest-explorer';
import { RestApplication } from '@loopback/rest';

import path from 'path';
import fs from 'fs';

import { MainSequence } from './sequence';
import { RadiodBindings } from './keys';

import { NowNone } from './now/now.none';
import { RepositoryMixin } from '@loopback/repository';

export class RadiodApplication extends BootMixin(RepositoryMixin(RestApplication)) {

  constructor(rootPath: string) {
    super(JSON.parse(fs.readFileSync(path.join(rootPath, 'config.json')).toString()));

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

    /* APPLICATION BINDING */
    this.bind(RadiodBindings.ROOT_PATH).to(rootPath);
    this.bind(RadiodBindings.CONFIG).toDynamicValue(() => {
      return JSON.parse(
        fs.readFileSync(path.join(rootPath, 'config.json')).toString()
      )
    });

    this.bind(RadiodBindings.API_KEY).toDynamicValue(() => {
      return JSON.parse(
        fs.readFileSync(path.join(rootPath, 'api_key.json')).toString()
      )
    });
    this.bind(RadiodBindings.NOW_SERVICE)
      .toClass(NowNone)
      .tag(CoreTags.LIFE_CYCLE_OBSERVER)
      .inScope(BindingScope.SINGLETON);

    /* STATIC BINDING */
    this.static('/', path.join(rootPath, 'client/build'));
    this.static('/jingles', path.join(rootPath, 'static/jingles.html'));
  }
}
