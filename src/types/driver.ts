import type { Prisma } from '@prisma/client';
import type { Entity, ListResponse } from './common';

// driver wordt gezien als de 'user' voor authenticatie
export interface Driver extends Entity {
  first_name: string;
  last_name: string;
  status: string | null;
  email: string;
  password_hash: string;
  roles: Prisma.JsonValue;
}

export interface DriverCreateInput {
  first_name: string;
  last_name: string;
  status: string | null;
  // login
  email: string;
  password: string;
}

export interface PublicDriver extends Pick<Driver, 'id' | 'email'> {}

export interface DriverUpdateInput extends Pick<DriverCreateInput, 'email'> {}

export interface CreateDriverRequest extends DriverCreateInput {}
export interface UpdateDriverRequest extends DriverUpdateInput {}

export interface GetAllDriversResponse extends ListResponse<Driver> {}
export interface GetDriverByIdResponse extends Driver {}
export interface CreateDriverResponse extends GetDriverByIdResponse {}
export interface UpdateDriverResponse extends GetDriverByIdResponse {}