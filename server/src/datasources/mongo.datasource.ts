import {
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
  ValueOrPromise,
  CoreBindings,
} from '@loopback/core';
import { juggler } from '@loopback/repository';

@lifeCycleObserver('datasource')
export class MongoDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'mongo';

  constructor(
    @inject(CoreBindings.APPLICATION_CONFIG) config: any
  ) {
    super(config.datasource);
  }

  /**
   * Start the datasource when application is started
   */
  start(): ValueOrPromise<void> {
    // Add your logic here to be invoked when the application is started
  }

  /**
   * Disconnect the datasource when application is stopped. This allows the
   * application to be shut down gracefully.
   */
  stop(): ValueOrPromise<void> {
    return super.disconnect();
  }
}
