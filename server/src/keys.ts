import { BindingKey } from '@loopback/context';
import { NowService, ConfigurationService } from './services';
import { TokenService, UserService } from '@loopback/authentication';
import { PasswordHasher } from './services/hash.password.bcryptjs';
import { User } from './models';
import { Credentials } from './repositories';

export namespace RadiodBindings {
  export const ROOT_PATH = BindingKey.create<string>('radiod.project-root');
  export const GLOBAL_CONFIG = BindingKey.create<any>('radiod.global-config');
  export const MONGO_CONFIG = BindingKey.create<object>('datasources.config.mongo');
  export const API_KEY = BindingKey.create<any>('radiod.api-key');
  export const NOW_SERVICE = BindingKey.create<NowService>('radiod.now-service');
  export const CONFIG_SERVICE = BindingKey.create<ConfigurationService>('radiod.config-service');
  export const USER_SERVICE = BindingKey.create<UserService<User, Credentials>>('services.user.service');
  export const TOKEN_SERVICE = BindingKey.create<TokenService>('services.authentication.jwt.tokenservice');
}

export namespace RadiodKeys {
  export const DEFAULT_CREDENTIAL = 'default_credential'
}

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = 'myjwts3cr3t';
  export const TOKEN_EXPIRES_IN_VALUE = '600';
}

export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>('authentication.jwt.secret');
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>('authentication.jwt.expires.in.seconds');
}

export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>('services.hasher');
  export const ROUNDS = BindingKey.create<number>('services.hasher.round');
}
