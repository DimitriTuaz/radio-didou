import { BootMixin } from '@loopback/boot';
import { ApplicationConfig, BindingScope, CoreTags } from '@loopback/core';
import { RestExplorerBindings, RestExplorerComponent } from '@loopback/rest-explorer';
import { RestApplication } from '@loopback/rest';

import path from 'path';

import { MainSequence } from './sequence';
import { RadiodBindings } from './keys';
import { NowSpotify } from './now/now.spotify'

export class RadiodApplication extends BootMixin(RestApplication) {

  constructor(options: ApplicationConfig = {}) {
    super(options);

    /* Loopback BINDINGS */
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

    /* Static BINDINGS */
    this.static('/', path.join(__dirname, '../../static'));
    this.static('/jingles', path.join(__dirname, '../../static/jingles.html'));

    /* Application BINDINGS */
    this.bind(RadiodBindings.PROJECT_ROOT).to(path.join(__dirname, '../..'));

    this.bind(RadiodBindings.NOW_SERVICE)
      .toClass(NowSpotify)
      .tag(CoreTags.LIFE_CYCLE_OBSERVER)
      .inScope(BindingScope.SINGLETON);
  }
}
