import { NowService, NowEnum } from '../services';

export class NowNone extends NowService {

  public serviceName = "NowNone";

  protected init(): void {
    this.now = {
      type: NowEnum.None,
    }
  }
  protected async fetch(): Promise<void> { }
}
