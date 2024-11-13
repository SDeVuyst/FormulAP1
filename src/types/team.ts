import type { Entity, ListResponse } from './common';

export interface Team extends Entity {
  name: string;
  country: string|null;
  join_date: Date;
}

export interface TeamCreateInput {
  name: string;
  country: string|null;
  join_date: Date;
}

export interface TeamUpdateInput extends TeamCreateInput {}

export interface CreateTeamRequest extends TeamCreateInput {}
export interface UpdateTeamRequest extends TeamUpdateInput {}

export interface GetAllTeamsResponse extends ListResponse<Team> {}
export interface GetTeamByIdResponse extends Team {}
export interface CreateTeamResponse extends GetTeamByIdResponse {}
export interface UpdateTeamResponse extends GetTeamByIdResponse {}