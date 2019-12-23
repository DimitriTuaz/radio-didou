import { get } from '@loopback/rest';
import { inject } from '@loopback/core';
import { NowService } from '../services/now.service';
import { RadiodBindings } from '../keys';

export class NowController {
  constructor(
    @inject(RadiodBindings.NOW_SERVICE)
    public service: NowService
  ) {
  }

  @get('/now')
  now(): any {
    return this.service.getNow();
  }
}
