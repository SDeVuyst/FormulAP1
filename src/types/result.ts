import type { Entity, ListResponse } from './common';
import type { Race } from './race';
import type { Driver } from './driver';

export interface Result extends Entity {
  position: number;
  points: number;
  status: string | null;
  race: Pick<Race, 'id'>;
  driver: Pick<Driver, 'id'>;
}

export interface ResultCreateInput {
  position: number;
  points: number;
  status: string | null;
  race_id: number;
  driver_id: number;
}

export interface ResultUpdateInput extends ResultCreateInput {}

export interface CreateResultRequest extends ResultCreateInput {}
export interface UpdateResultRequest extends ResultUpdateInput {}

export interface GetAllResultsResponse extends ListResponse<Result> {}
export interface GetResultByIdResponse extends Result {}
export interface CreateResultResponse extends GetResultByIdResponse {}
export interface UpdateResultResponse extends GetResultByIdResponse {}