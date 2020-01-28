import { DefaultCrudRepository } from '@loopback/repository';
import { NowCredentials, NowCredentialsRelations } from '../models';
import { MongoDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class NowCredentialsRepository extends DefaultCrudRepository<
  NowCredentials,
  typeof NowCredentials.prototype.id,
  NowCredentialsRelations
  > {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(NowCredentials, dataSource);
  }
}
