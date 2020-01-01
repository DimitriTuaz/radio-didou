import { setIntervalAsync, SetIntervalAsyncTimer } from 'set-interval-async/dynamic';
import { clearIntervalAsync } from 'set-interval-async';
import { LifeCycleObserver, Provider } from '@loopback/core';

import { INow } from '@common/now/now.common';
import request = require('superagent');

export abstract class NowService implements LifeCycleObserver, Provider<INow> {

  protected abstract init(value?: INow, token?: string): void;
  protected abstract async fetch(): Promise<void>;

  public abstract serviceName: string;
  private icecastURL: string;

  protected now: INow;
  private intervalID: SetIntervalAsyncTimer | null;

  constructor(configuration: any) {
    this.icecastURL = configuration.icecast + 'status-json.xsl';
  }

  public value(): INow {
    return this.now;
  }

  public start(value?: INow, token?: string): void {
    try {
      this.init(value, token);
      if (!this.intervalID) {
        console.log("[" + this.serviceName + "] started");
        this.intervalID = setIntervalAsync(
          async () => {
            await this.fetch();
            const response = await request
              .get(this.icecastURL)
              .set('Accept', 'application/json');
            this.now.listeners = response.body.source.listeners;
          },
          5000
        );
      }
    }
    catch (e) {
      console.log("[" + this.serviceName + "] Error! Couldn't start the service")
    }
  }

  public async stop(): Promise<void> {
    if (this.intervalID) {
      console.log("[" + this.serviceName + "] stopped");
      await clearIntervalAsync(this.intervalID);
      this.intervalID = null;
    }
  }
}
