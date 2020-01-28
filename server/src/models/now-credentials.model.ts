import { Entity, model, property } from '@loopback/repository';

@model()
export class NowCredentials extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  userId?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    required: true,
    default: 0,
  })
  type: number;

  @property({
    type: 'string',
    required: true,
  })
  token: string;


  constructor(data?: Partial<NowCredentials>) {
    super(data);
  }
}

export interface NowCredentialsRelations {
  // describe navigational properties here
}

export type NowCredentialsWithRelations = NowCredentials & NowCredentialsRelations;
