import type { Entity } from './common';

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