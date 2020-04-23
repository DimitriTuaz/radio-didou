import { get } from '@loopback/rest';
import { inject, BindingScope, bind, CoreBindings } from '@loopback/core';
import { model, property } from '@loopback/repository';

@model()
class Configuration {
  @property({ required: true }) icecast_url: string;
  @property({ required: true }) spotify_id: string;
  @property({ required: true }) deezer_id: string;
}

@bind({ scope: BindingScope.SINGLETON })
export class ConfigurationController {
  constructor(
    @inject(CoreBindings.APPLICATION_CONFIG) private global_config: any,
  ) { }

  /**
  ** Return the client configuration
  **/
  @get('/configuration', {
    responses: {
      '200': {
        description: 'Return the client configuration',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': Configuration,
            },
          },
        },
      },
    },
  })
  async getConfiguration(): Promise<Configuration> {
    return {
      icecast_url: `${this.global_config.icecast.url}/${this.global_config.icecast.mount_point}`,
      spotify_id: this.global_config.spotify.client_id,
      deezer_id: this.global_config.deezer.app_id,
    };
  }
}
