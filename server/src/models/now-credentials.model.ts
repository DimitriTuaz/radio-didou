import { Entity, model, property } from '@loopback/repository';

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
export class NowCredentials extends Entity {

  @property({ type: 'string', id: true, generated: true }) id?: string;
  @property({ type: 'string', required: false }) userId?: string;
  @property({ type: 'string', required: true }) name: string;
  @property({ type: 'number', required: true, default: 0 }) type: number;
  @property({ type: 'string', required: true }) token: string;
  @property({ type: 'string', required: false }) scope?: string;

  constructor(data?: Partial<NowCredentials>) {
    super(data);
  }
}

export interface NowCredentialsRelations {
}

export type NowCredentialsWithRelations = NowCredentials & NowCredentialsRelations;
