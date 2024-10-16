// src/service/race.ts
import { prisma } from '../data';
import type { Race, RaceCreateInput, RaceUpdateInput } from '../types/race';

// TODO: maybe include result ids?
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
  return prisma.race.findMany({
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
    throw new Error('No race with this id exists');
  }

  return race;
};

export const create = async ({ 
  date, 
  laps, 
  circuitId,
}: RaceCreateInput): Promise<Race> => {
  return prisma.race.create({
    data: {
      date, 
      laps, 
      circuit_id: circuitId,
    },
    select: RACE_SELECT,
  });
};

export const updateById = async (id: number, { 
  date, 
  laps, 
  circuitId,
}: RaceUpdateInput): Promise<Race> => {
  return prisma.race.update({
    where: {
      id,
    },
    data: {
      date,
      laps,
      circuit_id: circuitId,
    },
    select: RACE_SELECT,
  });
};

export const deleteById = async (id: number): Promise<void> => {
  await prisma.race.delete({
    where: {
      id,
    },
  });
};

export const getRacesByCircuitId = async (circuitId: number): Promise<Race[]> => {
  return prisma.race.findMany({
    where: {
      AND: [
        { circuit_id: circuitId },
      ],
    },
    select: RACE_SELECT,
  });
};