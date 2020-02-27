import { Entity, model, property } from '@loopback/repository';

@model()
export class PersistentKey extends Entity {
  @property({ type: 'string', id: true, generated: false, required: true }) key: string;
  @property({ type: 'string', required: true }) value: string;

  constructor(data?: Partial<PersistentKey>) {
    super(data);
  }
}

export interface PersistentKeyRelations {
}

export type PersistentKeyWithRelations = PersistentKey & PersistentKeyRelations;
