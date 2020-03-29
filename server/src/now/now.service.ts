import { setIntervalAsync, SetIntervalAsyncTimer } from 'set-interval-async/dynamic';
import { clearIntervalAsync } from 'set-interval-async';
import {
  LifeCycleObserver,
  inject,
  CoreBindings,
  Getter,
  Setter,
  Binding,
  BindingScope
} from '@loopback/core';
import { repository } from '@loopback/repository';

import request from 'superagent'
import { Logger } from 'winston';

import { RadiodBindings, RadiodKeys } from '../keys';
import { MediaCredentials } from '../models';
import {
  NowFetcher,
  NowNone,
  NowDeezer,
  NowSpotify,
  NowEnum,
  NowBindings
} from '../now'
import { PersistentKeyService } from '../services';
import { MediaCredentialsRepository } from '../repositories';
import { LoggingBindings } from '../logger';

export class NowService implements LifeCycleObserver {

  private icecastURL: string;
  private intervalID: SetIntervalAsyncTimer | null;

  constructor(
    @inject(CoreBindings.APPLICATION_CONFIG) configuration: any,
    @inject(RadiodBindings.PERSISTENT_KEY_SERVICE) private params: PersistentKeyService,
    @repository(MediaCredentialsRepository) private credentialRepository: MediaCredentialsRepository,
    @inject(LoggingBindings.LOGGER) private logger: Logger,
    @inject.getter(NowBindings.NOW_FETCHER) private fetcherGetter: Getter<NowFetcher>,
    @inject.binding(NowBindings.NOW_FETCHER) private fetcherBinding: Binding<NowFetcher>,
    @inject.setter(NowBindings.NOW_TOKEN) private tokenSetter: Setter<string>
  ) {
    this.icecastURL = configuration.icecast.url + '/status-json.xsl';
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

  public async setFetcher(credentials: MediaCredentials | undefined) {
    if (credentials == undefined) {
      this.fetcherBinding.to(new NowNone()).inScope(BindingScope.SINGLETON);
    }
    else {
      this.tokenSetter(credentials.token);
      switch (credentials.type) {
        case NowEnum.Spotify:
          this.fetcherBinding.toClass(NowSpotify)
            .inScope(BindingScope.SINGLETON);
          break;
        case NowEnum.Deezer:
          this.fetcherBinding.toClass(NowDeezer)
            .inScope(BindingScope.SINGLETON);
          break;
        default:
          this.fetcherBinding.toClass(NowNone)
            .inScope(BindingScope.SINGLETON);
          break;
      }
    }
    let fetcher = await this.fetcherGetter();
    this.logger.info("{NowService} setFetcher to " + fetcher.name);
  }

  public async start(): Promise<void> {
    await this.setDefaultFetcher();
    try {
      if (!this.intervalID) {
        this.logger.info("{LifeCycleObserver} NowService started");
        this.intervalID = setIntervalAsync(
          async () => {
            let fetcher = await this.fetcherGetter();
            await fetcher.fetch();
            const response = await request
              .get(this.icecastURL)
              .set('Accept', 'application/json');
            fetcher.now.listeners = response.body.icestats.source.listeners;
          },
          5000
        );
      }
    }
    catch (e) {
      this.logger.warn("{NowService} Error! Couldn't start the service");
    }
  }

  public async stop(): Promise<void> {
    if (this.intervalID) {
      this.logger.info("{LifeCycleObserver} NowService stopped");
      await clearIntervalAsync(this.intervalID);
      this.intervalID = null;
    }
  }
}
