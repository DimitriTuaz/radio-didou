import { BindingKey } from '@loopback/context';
import { NowService, PersistentKeyService, JWTService } from './services';
import { UserService } from '@loopback/authentication';
import { PasswordHasher } from './services/hash.password.bcryptjs';
import { User } from './models';
import { Credentials } from './repositories';
import { LOG_LEVEL, LoggerMetadata } from './logger';
import { LogFn } from './logger';

export namespace RadiodBindings {
  export const ROOT_PATH = BindingKey.create<string>('radiod.project-root');
  export const MONGO_CONFIG = BindingKey.create<object>('datasources.config.mongo');
  export const NOW_SERVICE = BindingKey.create<NowService>('radiod.now-service');
  export const PERSISTENT_KEY_SERVICE = BindingKey.create<PersistentKeyService>('radiod.config-service');
  export const USER_SERVICE = BindingKey.create<UserService<User, Credentials>>('services.user.service');
  export const TOKEN_SERVICE = BindingKey.create<JWTService>('services.authentication.jwt.tokenservice');
}

export namespace RadiodKeys {
  export const DEFAULT_CREDENTIAL = 'default_credential'
}

export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>('authentication.jwt.secret');
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>('authentication.jwt.expires.in.seconds');
}

export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>('services.hasher');
  export const ROUNDS = BindingKey.create<number>('services.hasher.round');
}

export namespace RadiodLogBindings {
  export const LOG_LEVEL = BindingKey.create<LOG_LEVEL>('radiod.log.level');
  export const METADATA = BindingKey.create<LoggerMetadata | undefined>('radiod.log.metadata');
  export const LOG_ACTION = BindingKey.create<LogFn>('radiod.log.action');
}
