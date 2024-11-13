import type { Entity, ListResponse } from './common';
import type { Team } from './team';

export interface Car extends Entity {
  model: string;
  weight: number;
  year: number;
  team: Pick<Team, 'id'>;
}

export interface CarCreateInput {
  model: string;
  weight: number;
  year: number;
  team_id: number;
}

export interface CarUpdateInput extends CarCreateInput {}

export interface CreateCarRequest extends CarCreateInput {}
export interface UpdateCarRequest extends CarUpdateInput {}

export interface GetAllCarsResponse extends ListResponse<Car> {}
export interface GetCarByIdResponse extends Car {}
export interface CreateCarResponse extends GetCarByIdResponse {}
export interface UpdateCarResponse extends GetCarByIdResponse {}