import { BindingKey } from '@loopback/context';
import { NowService } from './services';

export namespace RadiodBindings {
  export const ROOT_PATH = BindingKey.create<string>('radiod.project-root');
  export const NOW_SERVICE = BindingKey.create<NowService>('radiod.now-service');
}
