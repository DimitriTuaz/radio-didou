import { BindingKey } from '@loopback/context';

export namespace RadiodBindings {
  export const PROJECT_ROOT = BindingKey.create<string>('radiod.project_root');
}
