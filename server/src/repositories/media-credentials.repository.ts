import { DefaultCrudRepository, BelongsToAccessor, repository } from '@loopback/repository';
import { inject, Getter } from '@loopback/core';

import { MediaCredentials, MediaCredentialsRelations, User } from '../models';
import { MongoDataSource } from '../datasources';
import { UserRepository } from '../repositories';

export class MediaCredentialsRepository extends DefaultCrudRepository<
  MediaCredentials,
  typeof MediaCredentials.prototype.id,
  MediaCredentialsRelations> {

  public readonly user: BelongsToAccessor<User, typeof User.prototype.id>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
    @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>) {
    super(MediaCredentials, dataSource);
    this.user = this.createBelongsToAccessorFor(
      'user',
      userRepositoryGetter,
    );
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
