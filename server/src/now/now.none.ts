import { NowService } from '../services';
import { NowEnum } from '@common/now/now.common';

export class NowNone extends NowService {

  public serviceName = "NowNone";

  protected init(): void {
    this.now = {
      type: NowEnum.None,
    }
  }
  protected async fetch(): Promise<void> { }
}
