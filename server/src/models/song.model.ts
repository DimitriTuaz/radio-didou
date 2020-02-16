import { Entity, model, property, belongsTo } from '@loopback/repository';
import { User } from '../models';

@model({
  settings: {
    indexes: {
      uniqueURL: {
        keys: {
          url: 1,
          userId: 1,
        },
        options: {
          unique: true,
        },
      },
    },
  },
})
export class Song extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
    required: true,
  })
  album: string;

  @property({
    type: 'string',
    required: true,
  })
  artist: string;

  @property({
    type: 'string',
    required: true,
  })
  artwork: string;

  @property({
    type: 'string',
    required: true,
  })
  url: string;

  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<Song>) {
    super(data);
  }
}

export interface SongRelations {

}

export type SongWithRelations = Song & SongRelations;
