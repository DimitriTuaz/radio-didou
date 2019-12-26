import { get, param } from '@loopback/rest';
import { inject, Binding, BindingScope, Getter } from '@loopback/core';

import { RadiodBindings } from '../keys';

import { NowService, NowEnum } from '../services/now.service';
import { NowDeezer } from '../now/now.deezer';
import { NowSpotify } from '../now/now.spotify';
import { NowNone } from '../now/now.none';

export class NowController {
  constructor(
    @inject.getter(RadiodBindings.NOW_SERVICE) private serviceGetter: Getter<NowService>,
    @inject.binding(RadiodBindings.NOW_SERVICE) private serviceBinding: Binding<NowService>
  ) { }

  @get('/now/get')
  async getNow() {
    const service = await this.serviceGetter();
    return service.getNow();
  }

  @get('/now/set/{serviceId}')
  async setNowService(
    @param.path.number('serviceId') serviceId: number,
  ) {
    let service = await this.serviceGetter();
    service.stop();
    switch (serviceId) {
      case NowEnum.Spotify:
        this.serviceBinding.toClass(NowSpotify).inScope(BindingScope.SINGLETON);
        break;
      case NowEnum.Deezer:
        this.serviceBinding.toClass(NowDeezer).inScope(BindingScope.SINGLETON);
        break;
      default:
        this.serviceBinding.toClass(NowNone).inScope(BindingScope.SINGLETON);
    }
    service = await this.serviceGetter();
    service.start();
  }
}
