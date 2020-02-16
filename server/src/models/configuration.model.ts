import { Entity, model, property } from '@loopback/repository';

@model()
export class Configuration extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  key: string;

  @property({
    type: 'string',
    required: true,
  })
  value: string;

  constructor(data?: Partial<Configuration>) {
    super(data);
  }
}

export interface ConfigurationRelations {
  // describe navigational properties here
}

export type ConfigurationWithRelations = Configuration & ConfigurationRelations;
