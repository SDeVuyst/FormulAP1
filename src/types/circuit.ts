import type { Entity } from './common';

export interface Circuit extends Entity {
  name: string;
  city: string;
  country: string;
  active: boolean;
}

export interface CircuitCreateInput {
  name: string;
  city: string;
  country: string;
  active: boolean;
}

export interface CircuitUpdateInput extends CircuitCreateInput {}