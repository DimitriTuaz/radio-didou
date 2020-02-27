import { DefaultCrudRepository } from '@loopback/repository';
import { MediaCredentials, MediaCredentialsRelations } from '../models';
import { MongoDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class MediaCredentialsRepository extends DefaultCrudRepository<
  MediaCredentials,
  typeof MediaCredentials.prototype.id,
  MediaCredentialsRelations> {
  constructor(@inject('datasources.mongo') dataSource: MongoDataSource) {
    super(MediaCredentials, dataSource);
  }
}
