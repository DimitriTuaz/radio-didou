import { get } from '@loopback/rest';
import { inject, Binding, CoreTags, BindingScope } from '@loopback/core';
import { NowService } from '../services/now.service';
import { RadiodBindings } from '../keys';
import { NowDeezer } from '../now/now.deezer';
import { NowSpotify } from '../now/now.spotify';

export class NowController {
  constructor(
    @inject(RadiodBindings.NOW_SERVICE) public service: NowService,
    @inject.binding(RadiodBindings.NOW_SERVICE) private serviceBinding: Binding<NowService>
  ) { }

  @get('/getNow')
  getNow(): any {
    return this.service.getNow();
  }

  @get('/setNowService')
  async setNowService() {
    this.service.stop();
    this.serviceBinding.toClass(NowSpotify)
      .inScope(BindingScope.SINGLETON);
    this.service.start();
  }
}
