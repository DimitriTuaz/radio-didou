import { setIntervalAsync, SetIntervalAsyncTimer } from 'set-interval-async/dynamic';
import { clearIntervalAsync } from 'set-interval-async';
import { LifeCycleObserver, Provider, inject, CoreBindings, Getter, Setter, Binding, BindingScope } from '@loopback/core';

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
  private intervalID: SetIntervalAsyncTimer | null;

  constructor(
    @inject(CoreBindings.APPLICATION_CONFIG) configuration: any,
    @inject(RadiodBindings.PERSISTENT_KEY_SERVICE) private params: PersistentKeyService,
    @repository(MediaCredentialsRepository) private credentialRepository: MediaCredentialsRepository,
    @inject(LoggingBindings.LOGGER) private logger: Logger,
    @inject.getter(RadiodBindings.NOW_FETCHER) private fetcherGetter: Getter<NowFetcher>,
    @inject.binding(RadiodBindings.NOW_FETCHER) private fetcherBinding: Binding<NowFetcher>,
    @inject.setter(RadiodBindings.NOW_TOKEN) private tokenSetter: Setter<string>
  ) {
    this.icecastURL = configuration.icecast.url + '/status-json.xsl';
  }

  public async value() {
    let fetcher = await this.fetcherGetter();
    return fetcher.now;
  }

  public async setDefaultFetcher(): Promise<void> {
    try {
      let crendentialID: string = await this.params.get(RadiodKeys.DEFAULT_CREDENTIAL);
      let credential: MediaCredentials = await this.credentialRepository.findById(crendentialID);
      NowService.setFetcher(this.fetcherBinding, this.tokenSetter, credential);
    } catch (e) {
      NowService.setFetcher(this.fetcherBinding, this.tokenSetter, undefined);
    }
  }

  public static setFetcher(
    fetcherBinding: Binding<NowFetcher>,
    tokenSetter: Setter<string>,
    credentials?: MediaCredentials
  ) {
    if (credentials == undefined) {
      fetcherBinding.to(new NowNone()).inScope(BindingScope.SINGLETON);
    }
    else {
      tokenSetter(credentials.token);
      switch (credentials.type) {
        case NowEnum.Spotify:
          fetcherBinding.toClass(NowSpotify)
            .inScope(BindingScope.SINGLETON);
          break;
        case NowEnum.Deezer:
          fetcherBinding.toClass(NowDeezer)
            .inScope(BindingScope.SINGLETON);
          break;
        default:
          fetcherBinding.toClass(NowNone)
            .inScope(BindingScope.SINGLETON);
          break;
      }
    }
  }

  public async start(): Promise<void> {
    await this.setDefaultFetcher();
    try {
      if (!this.intervalID) {
        this.logger.info("[LifeCycleObserver] NowService started");
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
      this.logger.warn("[NowService] Error! Couldn't start the service")
    }
  }

  public async stop(): Promise<void> {
    if (this.intervalID) {
      this.logger.info("[LifeCycleObserver] NowService stopped");
      await clearIntervalAsync(this.intervalID);
      this.intervalID = null;
    }
  }
}
