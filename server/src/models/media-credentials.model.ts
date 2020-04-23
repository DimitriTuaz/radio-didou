import { Entity, model, property, belongsTo } from '@loopback/repository';
import { User, UserWithRelations } from '../models';

@model({
  settings: {
    indexes: {
      uniqueUser: {
        keys: {
          userId: 1,
          type: 1,
          scope: 1
        },
        options: {
          unique: true,
        },
      },
    },
  },
})
export class MediaCredentials extends Entity {

  @property({ type: 'string', id: true, generated: true }) id?: string;
  @belongsTo(() => User) userId: string;
  @property({ type: 'number', required: true, default: 0 }) type: number;
  @property({ type: 'string', required: true }) token: string;
  @property({ type: 'string', required: true }) identifier: string;
  @property({ type: 'string', required: false }) name?: string;
  @property({ type: 'string', required: false }) scope?: string;

  constructor(data?: Partial<MediaCredentials>) {
    super(data);
  }
}

export interface MediaCredentialsRelations {
  user?: UserWithRelations;
}

export type MediaCredentialsWithRelations = MediaCredentials & MediaCredentialsRelations;
