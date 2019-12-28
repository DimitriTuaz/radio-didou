import { DefaultCrudRepository } from '@loopback/repository';
import { Credential, CredentialRelations } from '../models';
import { MongoDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class CredentialRepository extends DefaultCrudRepository<
  Credential,
  typeof Credential.prototype.id,
  CredentialRelations
  > {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Credential, dataSource);
  }
}
