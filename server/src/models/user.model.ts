import { Entity, model, property, hasOne, hasMany } from '@loopback/repository';
import { UserCredentials, UserCredentialsWithRelations } from './user-credentials.model';
import { Song } from '../models';

@model({
  settings: {
    indexes: {
      uniqueEmail: {
        keys: {
          email: 1,
        },
        options: {
          unique: true,
        },
      },
    },
  },
})
export class User extends Entity {
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
  email: string;

  @property({
    type: 'string',
  })
  firstName?: string;

  @property({
    type: 'string',
  })
  lastName?: string;

  @hasOne(() => UserCredentials)
  userCredentials: UserCredentials;

  @hasMany(() => Song)
  songs: Song[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  userCredentials?: UserCredentialsWithRelations;
}

export type UserWithRelations = User & UserRelations;
