import type { Entity } from './common';
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
  raceId: number;
  driverId: number;
}

export interface ResultUpdateInput extends ResultCreateInput {}