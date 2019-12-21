import { BootMixin } from '@loopback/boot';
import { ApplicationConfig, BindingKey } from '@loopback/core';
import {
  RestExplorerBindings, RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RestApplication } from '@loopback/rest';
import path from 'path';
import { MainSequence } from './sequence';

import { NowService } from './services/now.service'

export class RadiodApplication extends BootMixin(RestApplication) {

  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.projectRoot = __dirname;
    this.sequence(MainSequence);

    this.static('/', path.join(__dirname, '../../static'));
    this.static('/jingles', path.join(__dirname, '../../static/jingles.html'));

    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer'
    });

    this.component(RestExplorerComponent);

    this.service(NowService);

    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}