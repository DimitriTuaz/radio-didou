import { setIntervalAsync, SetIntervalAsyncTimer } from 'set-interval-async/dynamic';
import { clearIntervalAsync } from 'set-interval-async';
import {
  LifeCycleObserver,
  inject,
  CoreBindings,
  Setter,
  BindingScope,
  Getter,
  Binding,
  BindingCreationPolicy
} from '@loopback/core';
import { repository, model, property } from '@loopback/repository';

import request from 'superagent'
import { Logger } from 'winston';

import { RadiodBindings, RadiodKeys } from '../keys';
import { MediaCredentials } from '../models';
import { PersistentKeyService } from '../services';
import { MediaCredentialsRepository } from '../repositories';
import { LoggingBindings } from '../logger';

import { NowBindings } from './now.keys';
import { NowEnum, NowFetcher } from './now.fetcher';
import { NowLive } from './now.live';
import { NowSpotify } from './now.spotify';
import { NowDeezer } from './now.deezer';
import { NowNone } from './now.none';
import { NowObject } from './now.component';

export enum NowMode {
  Normal = 0,
  Live = 1
}

@model()
export class NowState {
  @property({ required: true, type: 'number' }) type: NowMode;
  @property({ required: false }) name?: string;
  @property({ required: false }) userId?: string;
  @property({ required: false }) song?: string;
  @property({ required: false }) artist?: string;
  @property({ required: false }) album?: string;
  @property({ required: false }) url?: string;
}

export class NowService implements LifeCycleObserver {

  private icecastURL: string;
  private intervalID: SetIntervalAsyncTimer | null;

  constructor(
    @inject(CoreBindings.APPLICATION_CONFIG) configuration: any,
    @inject(RadiodBindings.PERSISTENT_KEY_SERVICE) private params: PersistentKeyService,
    @repository(MediaCredentialsRepository) private credentialRepository: MediaCredentialsRepository,
    @inject(LoggingBindings.LOGGER) private logger: Logger,
    @inject.setter(NowBindings.NOW_TOKEN) private tokenSetter: Setter<string>,
    @inject.getter(NowBindings.NOW_STATE) private stateGetter: Getter<NowState>,
    @inject.setter(NowBindings.NOW_STATE) private stateSetter: Setter<NowState>,
    @inject.getter(NowBindings.NOW_FETCHER) private fetcherGetter: Getter<NowFetcher>,
    @inject.binding(
      NowBindings.NOW_FETCHER,
      { bindingCreation: BindingCreationPolicy.ALWAYS_CREATE }
    )
    private fetcherBinding: Binding<NowFetcher>,
    @inject.getter(NowBindings.CURRENT_NOW) private nowGetter: Getter<NowObject>,
    @inject.setter(NowBindings.CURRENT_NOW) private nowSetter: Setter<NowObject>
  ) {
    this.icecastURL = configuration.icecast.url + '/status-json.xsl';
  }

  public async setDefaultFetcher(): Promise<void> {
    // KEEPING SOME VALUES
    let state: NowState;
    try {
      state = await this.stateGetter();
      state.type = NowMode.Normal;
    } catch (e) {
      state = { type: NowMode.Normal };
    }
    try {
      let crendentialID: string = await this.params.get(RadiodKeys.DEFAULT_CREDENTIAL);
      let credential: MediaCredentials = await this.credentialRepository.findById(crendentialID);
      state.userId = credential.userId;
      this.setFetcher(state, credential);
    } catch (e) {
      state.userId = undefined;
      this.setFetcher(state, undefined);
    }
  }

  public async setFetcher(state: NowState, credential: MediaCredentials | undefined) {
    this.stateSetter(state);
    if (state.type === NowMode.Live) {
      this.fetcherBinding.toClass(NowLive).inScope(BindingScope.SINGLETON);
    }
    else {
      if (credential !== undefined) {
        this.tokenSetter(credential.token);
        switch (credential.type) {
          case NowEnum.Spotify:
            this.fetcherBinding.toClass(NowSpotify).inScope(BindingScope.SINGLETON);
            break;
          case NowEnum.Deezer:
            this.fetcherBinding.toClass(NowDeezer).inScope(BindingScope.SINGLETON);
            break;
        }
      }
      else {
        this.fetcherBinding.toClass(NowNone).inScope(BindingScope.SINGLETON);
      }
    }
    let fetcher = await this.fetcherGetter();
    this.logger.info("[NowService] setFetcher to " + fetcher.name);
  }

  public async start(): Promise<void> {
    await this.setDefaultFetcher();
    try {
      if (!this.intervalID) {
        this.logger.info("[LifeCycleObserver] NowService started");
        this.intervalID = setIntervalAsync(
          async () => {
            const response = await request
              .get(this.icecastURL)
              .set('Accept', 'application/json');
            let fetcher = await this.fetcherGetter();
            await fetcher.fetch();
            let now: NowObject = await this.nowGetter();
            now.listeners = response.body.icestats.source.listeners;
            this.nowSetter(now);
          },
          5000
        );
      }
    }
    catch (e) {
      this.logger.warn("[NowService] Error! Couldn't start the service");
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
