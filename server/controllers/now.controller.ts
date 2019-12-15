import { get } from '@loopback/rest';
import { inject } from '@loopback/core';
import { NowService } from '../services/now.service';

export class NowController {
  constructor(
    @inject('radiod.now-service')
    public service: NowService
  ) {
  }

  @get('/now')
  now(): any {
    return this.service.getNow();
  }
}
