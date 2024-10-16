// src/service/race.ts
import { prisma } from '../data';

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

export const getAll = async () => {
  return prisma.race.findMany({
    select: RACE_SELECT,
  });
};

export const getById = async (id: number) => {
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

export const create = async ({ date, laps, circuit_id }: any) => {
  return prisma.race.create({
    data: {
      date, 
      laps, 
      circuit_id,
    },
  });
};

export const updateById = async (id: number, { date, laps, circuit_id }: any) => {
  return prisma.race.update({
    where: {
      id,
    },
    data: {
      date,
      laps,
      circuit_id,
    },
  });
};

export const deleteById = async (id: number) => {
  await prisma.race.delete({
    where: {
      id,
    },
  });
};

export const getRacesByCircuitId = async (circuitId: number) => {
  return prisma.race.findMany({
    where: {
      AND: [
        { circuit_id: circuitId },
      ],
    },
    select: RACE_SELECT,
  });
};