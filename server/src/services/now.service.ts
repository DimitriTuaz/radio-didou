import { setIntervalAsync, SetIntervalAsyncTimer } from 'set-interval-async/dynamic';
import { clearIntervalAsync } from 'set-interval-async';
import { LifeCycleObserver, Provider, inject, CoreBindings } from '@loopback/core';

import { RadiodBindings, RadiodKeys } from '../keys';
import { MediaCredentials } from '../models';
import { NowFetcher, NowNone, NowDeezer, NowSpotify, NowObject, NowEnum } from '../now'
import { PersistentKeyService } from '../services';
import { repository } from '@loopback/repository';
import { MediaCredentialsRepository } from '../repositories';
import { LoggingBindings } from '../logger';

import request from 'superagent'
import { Logger } from 'winston';

export class NowService implements LifeCycleObserver, Provider<NowObject> {

  private icecastURL: string;
  private fetcher: NowFetcher;
  private intervalID: SetIntervalAsyncTimer | null;

  constructor(
    @inject(CoreBindings.APPLICATION_CONFIG) private configuration: any,
    @inject(RadiodBindings.PERSISTENT_KEY_SERVICE) private params: PersistentKeyService,
    @repository(MediaCredentialsRepository) private credentialRepository: MediaCredentialsRepository,
    @inject(LoggingBindings.LOGGER) private logger: Logger) {
    this.icecastURL = configuration.icecast.url + '/status-json.xsl';
    this.fetcher = new NowNone();
  }

  public value(): NowObject {
    return this.fetcher.now;
  }

  public async setDefaultFetcher(): Promise<void> {
    try {
      let crendentialID: string = await this.params.get(RadiodKeys.DEFAULT_CREDENTIAL);
      let credential: MediaCredentials = await this.credentialRepository.findById(crendentialID);
      this.setFetcher(credential);
    } catch (e) {
      this.setFetcher(undefined);
    }
  }

  public setFetcher(credentials?: MediaCredentials): void {
    if (credentials == undefined) {
      this.fetcher = new NowNone();
    }
    else {
      switch (credentials.type) {
        case NowEnum.Spotify:
          this.fetcher = new NowSpotify(credentials.token, this.configuration.spotify, this.fetcher.now);
          break;
        case NowEnum.Deezer:
          this.fetcher = new NowDeezer(credentials.token, this.fetcher.now);
          break;
        default:
          this.fetcher = new NowNone();
          break;
      }
    }
    this.logger.info("[NowService - " + this.fetcher.name + "] setFetcher");
  }

  public async start(): Promise<void> {
    await this.setDefaultFetcher();
    try {
      if (!this.intervalID) {
        this.logger.info("[NowService - " + this.fetcher.name + "] started");
        this.intervalID = setIntervalAsync(
          async () => {
            await this.fetcher.fetch();
            const response = await request
              .get(this.icecastURL)
              .set('Accept', 'application/json');
            this.fetcher.now.listeners = response.body.icestats.source.listeners;
          },
          5000
        );
      }
    }
    catch (e) {
      this.logger.warn("[NowService - " + this.fetcher.name + "] Error! Couldn't start the service")
    }
  }

  public async stop(): Promise<void> {
    if (this.intervalID) {
      this.logger.info("[NowService - " + this.fetcher.name + "] stopped");
      await clearIntervalAsync(this.intervalID);
      this.intervalID = null;
    }
  }
}
