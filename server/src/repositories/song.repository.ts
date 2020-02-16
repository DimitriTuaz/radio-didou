import { DefaultCrudRepository } from '@loopback/repository';
import { MongoDataSource } from '../datasources';
import { Song, SongRelations } from '../models';
import { inject } from '@loopback/core';

export class SongRepository extends DefaultCrudRepository<
  Song,
  typeof Song.prototype.id,
  SongRelations> {
  constructor(@inject('datasources.mongo') dataSource: MongoDataSource) {
    super(Song, dataSource);
  }
}
