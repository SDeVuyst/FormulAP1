import type { Circuit } from './circuit';
import type { Entity, ListResponse } from './common';

export interface Race extends Entity {
  date: Date;
  laps: number;
  circuit: Pick<Circuit, 'id' | 'name'>;
}

export interface RaceCreateInput {
  date: Date;
  laps: number;
  circuit_id: number;
}

export interface RaceUpdateInput extends RaceCreateInput {}

export interface CreateRaceRequest extends RaceCreateInput {}
export interface UpdateRaceRequest extends RaceUpdateInput {}

export interface GetAllRacesResponse extends ListResponse<Race> {}
export interface GetRaceByIdResponse extends Race {}
export interface CreateRaceResponse extends GetRaceByIdResponse {}
export interface UpdateRaceResponse extends GetRaceByIdResponse {}
