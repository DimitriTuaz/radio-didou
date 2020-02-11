import { Entity, model, property } from '@loopback/repository';

@model({
  settings: {
    indexes: {
      uniqueURL: {
        keys: {
          url: 1,
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
  artwork: string;

  @property({
    type: 'string',
    required: true,
  })
  url: string;

  constructor(data?: Partial<Song>) {
    super(data);
  }
}

export interface SongRelations {

}

export type SongWithRelations = Song & SongRelations;
