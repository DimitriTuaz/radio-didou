import { setIntervalAsync, SetIntervalAsyncTimer } from 'set-interval-async/dynamic';
import { clearIntervalAsync } from 'set-interval-async';
import { LifeCycleObserver, Provider } from '@loopback/core';

import { INow } from '@common/now/now.common';

export abstract class NowService implements LifeCycleObserver, Provider<INow> {

  protected abstract init(): void;
  protected abstract async fetch(): Promise<void>;
  public abstract serviceName: string;

  protected now: INow;
  private isRunning: boolean = false;
  private intervalID: SetIntervalAsyncTimer;

  public value(): INow {
    return this.now;
  }

  public start(): void {
    try {
      this.init();
      if (!this.isRunning) {
        console.log("[" + this.serviceName + "] started");
        this.isRunning = true;
        this.intervalID = setIntervalAsync(
          async () => await this.fetch(),
          5000
        );
      }
    }
    catch (e) {
      console.log("[" + this.serviceName + "] Error! Couldn't start the service")
    }
  }

  public async stop(): Promise<void> {
    if (this.isRunning) {
      console.log("[" + this.serviceName + "] stopped");
      await clearIntervalAsync(this.intervalID);
      this.isRunning = false;
    }
  }
}
