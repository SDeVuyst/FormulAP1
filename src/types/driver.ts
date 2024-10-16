import type { Entity, ListResponse } from './common';

export interface Driver extends Entity {
  first_name: string;
  last_name: string;
  status: string | null;
}

export interface DriverCreateInput {
  first_name: string;
  last_name: string;
  status: string | null;
}

export interface DriverUpdateInput extends DriverCreateInput {}

export interface CreateDriverRequest extends DriverCreateInput {}
export interface UpdateDriverRequest extends DriverUpdateInput {}

export interface GetAllDriversResponse extends ListResponse<Driver> {}
export interface GetDriverByIdResponse extends Driver {}
export interface CreateDriverResponse extends GetDriverByIdResponse {}
export interface UpdateDriverResponse extends GetDriverByIdResponse {}