import { bind, BindingScope } from '@loopback/core';
import { ConfigurationRepository } from '../repositories/configuration.repository';
import { repository } from '@loopback/repository';
import { Configuration } from '../models/configuration.model';

@bind({ scope: BindingScope.SINGLETON })
export class ConfigurationService {
  constructor(
    @repository(ConfigurationRepository) private configurationRepository: ConfigurationRepository
  ) { }

  public async set(key: string, value: string): Promise<void> {
    let configuration: Configuration = new Configuration({
      key: key,
      value: value
    });
    if (!(await this.configurationRepository.exists(key))) {
      await this.configurationRepository.create(configuration);
    }
    else {
      await this.configurationRepository.replaceById(key, configuration);
    }
  }

  public async get(key: string): Promise<string> {
    let configuration: Configuration = await this.configurationRepository.findById(key);
    return configuration.value;
  }

  public exists(key: string): Promise<boolean> {
    return this.configurationRepository.exists(key);
  }

  public delete(key: string): Promise<void> {
    return this.configurationRepository.deleteById(key);
  }
}
