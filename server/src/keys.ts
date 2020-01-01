import { BindingKey } from '@loopback/context';
import { NowService, ConfigurationService } from './services';

export namespace RadiodBindings {
  export const ROOT_PATH = BindingKey.create<string>('radiod.project-root');
  export const CONFIG = BindingKey.create<any>('radiod.config');
  export const API_KEY = BindingKey.create<any>('radiod.api-key');
  export const NOW_SERVICE = BindingKey.create<NowService>('radiod.now-service');
  export const CONFIG_SERVICE = BindingKey.create<ConfigurationService>('radiod.config-service');
}

export namespace RadiodKeys {
  export const DEFAULT_CREDENTIAL = 'default_credential'
}
