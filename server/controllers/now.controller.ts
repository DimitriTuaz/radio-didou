import { get } from '@loopback/rest';

export class NowController {
  @get('/now')
  now(): string {
    return 'now!';
  }
}
