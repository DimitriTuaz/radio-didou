import { BindingKey } from '@loopback/context';
import { UserService } from '@loopback/authentication';

import { PersistentKeyService, JWTService, PasswordHasher } from './services';
import { User } from './models';
import { Credentials } from './repositories';
import { NowFetcher, NowObject } from './now';

export namespace RadiodBindings {
  export const ROOT_PATH = BindingKey.create<string>('radiod.project-root');
  export const MONGO_CONFIG = BindingKey.create<object>('datasources.config.mongo');
  export const NOW_OBJECT = BindingKey.create<NowObject>('radiod.now-object');
  export const NOW_FETCHER = BindingKey.create<NowFetcher>('radiod.now-fetcher');
  export const NOW_TOKEN = BindingKey.create<string>('radiod.now-token');
  export const PERSISTENT_KEY_SERVICE = BindingKey.create<PersistentKeyService>('radiod.config-service');
  export const USER_SERVICE = BindingKey.create<UserService<User, Credentials>>('services.user.service');
}

export namespace RadiodKeys {
  export const DEFAULT_CREDENTIAL = 'default_credential'
}

export namespace TokenServiceBindings {
  export const TOKEN_SERVICE = BindingKey.create<JWTService>('services.authentication.jwt.tokenservice');
  export const TOKEN_SECRET = BindingKey.create<string>('authentication.jwt.secret');
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>('authentication.jwt.expires.in.seconds');
}

export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>('services.hasher');
  export const ROUNDS = BindingKey.create<number>('services.hasher.round');
}
