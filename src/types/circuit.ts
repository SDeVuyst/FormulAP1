import type { Entity, ListResponse } from './common';

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

export interface CreateCircuitRequest extends CircuitCreateInput {}
export interface UpdateCircuitRequest extends CircuitUpdateInput {}

export interface GetAllCircuitsResponse extends ListResponse<Circuit> {}
export interface GetCircuitByIdResponse extends Circuit {}
export interface CreateCircuitResponse extends GetCircuitByIdResponse {}
export interface UpdateCircuitResponse extends GetCircuitByIdResponse {}