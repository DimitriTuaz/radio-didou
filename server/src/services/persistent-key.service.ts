import { bind, BindingScope } from '@loopback/core';
import { PersistentKeyRepository } from '../repositories';
import { repository } from '@loopback/repository';
import { PersistentKey } from '../models';

@bind({ scope: BindingScope.SINGLETON })
export class PersistentKeyService {
  constructor(
    @repository(PersistentKeyRepository) private repository: PersistentKeyRepository
  ) { }

  public async set(key: string, value: string): Promise<void> {
    let configuration: PersistentKey = new PersistentKey({
      key: key,
      value: value
    });
    if (!(await this.repository.exists(key))) {
      await this.repository.create(configuration);
    }
    else {
      await this.repository.replaceById(key, configuration);
    }
  }

  public async get(key: string): Promise<string> {
    let configuration: PersistentKey = await this.repository.findById(key);
    return configuration.value;
  }

  public exists(key: string): Promise<boolean> {
    return this.repository.exists(key);
  }

  public delete(key: string): Promise<void> {
    return this.repository.deleteById(key);
  }
}
