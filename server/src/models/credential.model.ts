import {Entity, model, property} from '@loopback/repository';

@model()
export class Credential extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  token: string;

  @property({
    type: 'number',
    required: true,
    default: 0,
  })
  type: number;

  @property({
    type: 'number',
  })
  userID?: number;


  constructor(data?: Partial<Credential>) {
    super(data);
  }
}

export interface CredentialRelations {
  // describe navigational properties here
}

export type CredentialWithRelations = Credential & CredentialRelations;
