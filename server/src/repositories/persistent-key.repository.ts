import { DefaultCrudRepository } from '@loopback/repository';
import { PersistentKey, PersistentKeyRelations } from '../models';
import { MongoDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class PersistentKeyRepository extends DefaultCrudRepository<
  PersistentKey,
  typeof PersistentKey.prototype.key,
  PersistentKeyRelations
  > {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(PersistentKey, dataSource);
  }
}
