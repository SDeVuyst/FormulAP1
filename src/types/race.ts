import type { Circuit } from './circuit';
import type { Entity } from './common';

export interface Race extends Entity {
  date: Date;
  laps: number;
  circuit: Pick<Circuit, 'id' | 'name'>;
}

export interface RaceCreateInput {
  date: Date;
  laps: number;
  circuitId: number;
}

export interface RaceUpdateInput extends RaceCreateInput {}
