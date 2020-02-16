import {DefaultCrudRepository} from '@loopback/repository';
import {Configuration, ConfigurationRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ConfigurationRepository extends DefaultCrudRepository<
  Configuration,
  typeof Configuration.prototype.key,
  ConfigurationRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Configuration, dataSource);
  }
}
