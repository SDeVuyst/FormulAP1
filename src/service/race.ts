// src/service/race.ts
import { prisma } from '../data';
import type { Race, RaceCreateInput, RaceUpdateInput } from '../types/race';

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
    throw new Error('No race with this id exists');
  }

  return race;
};

export const create = async ({ 
  date, 
  laps, 
  circuit_id,
}: RaceCreateInput): Promise<Race> => {
  return await prisma.race.create({
    data: {
      date, 
      laps, 
      circuit_id: circuit_id,
    },
    select: RACE_SELECT,
  });
};

export const updateById = async (id: number, { 
  date, 
  laps, 
  circuit_id,
}: RaceUpdateInput): Promise<Race> => {
  
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
};

export const deleteById = async (id: number): Promise<void> => {
  await prisma.race.delete({
    where: {
      id,
    },
  });
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