import { get } from '@loopback/rest';
import { service } from '@loopback/core';
import { NowService } from '../services/now.service';

export class NowController {
  constructor(
    @service(NowService)
    public service: NowService
  ) {
  }

  @get('/now')
  now(): any {
    return this.service.getNow();
  }
}
