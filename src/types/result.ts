import type { Entity, ListResponse } from './common';
import type { Race } from './race';
import type { Driver } from './driver';
import type { Car } from './car';

export interface Result extends Entity {
  position: number;
  points: number;
  status: string | null;
  race: Pick<Race, 'id'>;
  driver: Pick<Driver, 'id'>;
  car: Pick<Car, 'id'>;
}

export interface ResultCreateInput {
  position: number;
  points: number;
  status: string | null;
  race_id: number;
  driver_id: number;
  car_id: number
}

export interface ResultUpdateInput extends ResultCreateInput {}

export interface CreateResultRequest extends ResultCreateInput {}
export interface UpdateResultRequest extends ResultUpdateInput {}

export interface GetAllResultsResponse extends ListResponse<Result> {}
export interface GetResultByIdResponse extends Result {}
export interface CreateResultResponse extends GetResultByIdResponse {}
export interface UpdateResultResponse extends GetResultByIdResponse {}