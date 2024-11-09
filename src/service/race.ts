// src/service/race.ts
import ServiceError from '../core/serviceError';
import { prisma } from '../data';
import type { Race, RaceCreateInput, RaceUpdateInput } from '../types/race';
import handleDBError from './_handleDBError';
import * as circuitService from './circuit';

const RACE_SELECT = {
  id: true,
  date: true,
  laps: true,
  circuit: {
    select: {
      id: true,
      name: true,
    },
  },
};

export const getAll = async (): Promise<Race[]> => {
  return await prisma.race.findMany({
    select: RACE_SELECT,
  });
};

export const getById = async (id: number): Promise<Race> => {
  const race = await prisma.race.findUnique({
    where: {
      id,
    },
    select: RACE_SELECT,
  });

  if (!race) {
    throw ServiceError.notFound('No race with this id exists');
  }

  return race;
};

export const create = async ({ 
  date, 
  laps, 
  circuit_id,
}: RaceCreateInput): Promise<Race> => {
  try {

    await circuitService.checkCircuitExists(circuit_id);

    return await prisma.race.create({
      data: {
        date, 
        laps, 
        circuit_id: circuit_id,
      },
      select: RACE_SELECT,
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const updateById = async (id: number, { 
  date, laps, circuit_id,

}: RaceUpdateInput): Promise<Race> => {
  try {
    return await prisma.race.update({
      where: {
        id,
      },
      data: {
        date,
        laps,
        circuit_id: circuit_id,
      },
      select: RACE_SELECT,
    });
  } catch (error: any) {
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number): Promise<void> => {
  try {
    await prisma.race.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    handleDBError(error);
  }
};

export const getRacesByCircuitId = async (circuit_id: number): Promise<Race[]> => {
  return await prisma.race.findMany({
    where: {
      AND: [
        { circuit_id: circuit_id },
      ],
    },
    select: RACE_SELECT,
  });
};

export const checkRaceExists = async (id: number) => {
  const count = await prisma.race.count({
    where: {
      id,
    },
  });

  if (count === 0) {
    throw ServiceError.notFound('No race with this id exists');
  }
};