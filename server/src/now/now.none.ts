import { NowService } from '../services';
import { NowEnum } from '@common/now/now.common';
import { inject } from '@loopback/core';
import { RadiodBindings } from '../keys';

export class NowNone extends NowService {

  public serviceName = "NowNone";

  constructor(@inject(RadiodBindings.CONFIG) private configuration: any) {
    super(configuration)
  }

  protected init(): void {
    this.now = {
      type: NowEnum.None,
      listeners: 0,
      song: '',
      artists: [],
    }
  }
  protected async fetch(): Promise<void> { }
}
