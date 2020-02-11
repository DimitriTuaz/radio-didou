import {
  DefaultCrudRepository,
  repository,
  HasOneRepositoryFactory,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import { MongoDataSource } from '../datasources';
import { User, UserCredentials, Song } from '../models';
import { inject, Getter } from '@loopback/core';
import { UserCredentialsRepository, SongRepository } from '../repositories';

export type Credentials = {
  email: string;
  password: string;
};

export class UserRepository extends DefaultCrudRepository<User, typeof User.prototype.id> {

  public readonly userCredentials: HasOneRepositoryFactory<UserCredentials, typeof User.prototype.id>;
  public readonly songs: HasManyRepositoryFactory<Song, typeof Song.prototype.id>;

  constructor(
    @inject('datasources.mongo') protected datasource: MongoDataSource,
    @repository.getter('UserCredentialsRepository') protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
    @repository.getter('SongRepository') protected songRepositoryGetter: Getter<SongRepository>) {
    super(User, datasource);
    this.userCredentials = this.createHasOneRepositoryFactoryFor(
      'userCredentials',
      userCredentialsRepositoryGetter
    );
    this.songs = this.createHasManyRepositoryFactoryFor(
      'songs',
      songRepositoryGetter
    );
  }

  async findCredentials(userId: typeof User.prototype.id): Promise<UserCredentials | undefined> {
    try {
      return await this.userCredentials(userId).get();
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }
      throw err;
    }
  }
}
