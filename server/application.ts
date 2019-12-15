import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import {
  RestExplorerBindings, RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RestApplication } from '@loopback/rest';
import path from 'path';
import { MainSequence } from './sequence';

import { BindingScope } from '@loopback/context';
import { NowService } from './services/now.service'

export class RadiodApplication extends BootMixin(RestApplication) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.projectRoot = __dirname;
    this.sequence(MainSequence);

    this.static('/', path.join(__dirname, '../static'));

    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer'
    });

    this.component(RestExplorerComponent);
    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    this.initNowService();
  }

  private async initNowService() {
    this.bind('radiod.now-service')
      .toClass(NowService)
      .inScope(BindingScope.SINGLETON);

    var service: NowService = await this.get('radiod.now-service');
    service.start();
  }
}
