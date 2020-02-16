import { DefaultCrudRepository } from '@loopback/repository';
import { MongoDataSource } from '../datasources';
import { UserCredentials, UserCredentialsRelations } from '../models';
import { inject } from '@loopback/core';

export class UserCredentialsRepository extends DefaultCrudRepository<
  UserCredentials,
  typeof UserCredentials.prototype.id,
  UserCredentialsRelations> {
  constructor(@inject('datasources.mongo') dataSource: MongoDataSource) {
    super(UserCredentials, dataSource);
  }
}
