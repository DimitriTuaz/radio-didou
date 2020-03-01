import { Entity, model, property, belongsTo } from '@loopback/repository';
import { User, UserWithRelations } from '../models';

@model()
export class UserCredentials extends Entity {

  @property({ type: 'string', id: true, generated: true }) id: string;
  @property({ type: 'string', required: true }) password: string;
  @belongsTo(() => User) userId: string;

  constructor(data?: Partial<UserCredentials>) {
    super(data);
  }
}

export interface UserCredentialsRelations {
  user?: UserWithRelations;
}

export type UserCredentialsWithRelations = UserCredentials & UserCredentialsRelations;
