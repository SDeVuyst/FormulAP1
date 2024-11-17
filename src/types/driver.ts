import type { Prisma } from '@prisma/client';
import type { Entity, ListResponse } from './common';
import type { Team } from './team';

// driver wordt gezien als de 'user' voor authenticatie
export interface Driver extends Entity {
  first_name: string;
  last_name: string;
  status: string | null;
  email: string;
  password_hash: string;
  roles: Prisma.JsonValue;
  team?: Pick<Team, 'id' | 'name'> | null;
}

export interface DriverCreateInput {
  first_name: string;
  last_name: string;
  status: string | null;
  team_id: number | null;
  // login
  email: string;
  password: string;
}

export interface PublicDriver extends Pick<Driver, 'id' | 'first_name' | 'last_name' | 'status' | 'email' > { 
  team?: Pick<Team, 'id' | 'name'> | undefined; 
}

export interface DriverUpdateInput extends Pick<DriverCreateInput, 'email'> {}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface GetDriverRequest {
  id: number | 'me';
}

export interface RegisterDriverRequest {
  first_name: string;
  last_name: string,
  status: string|null,
  email: string;
  password: string;
  team_id: number|null;
}

export interface CreateDriverRequest extends DriverCreateInput {}
export interface UpdateDriverRequest extends DriverUpdateInput {}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface GetDriverRequest {
  id: number | 'me';
}
export interface RegisterDriverRequest {
  email: string;
  password: string;
}
export interface UpdateDriverRequest extends Pick<RegisterDriverRequest, 'email'> {}

export interface GetAllDriversResponse extends ListResponse<PublicDriver> {}
export interface GetDriverByIdResponse extends PublicDriver {}
export interface UpdateDriverResponse extends GetDriverByIdResponse {}

export interface LoginResponse {
  token: string;
}