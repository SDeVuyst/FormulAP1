// src/service/result.ts
import { prisma } from '../data';

const RESULT_SELECT = {
  id: true,
  position: true,
  points: true,
  status: true,
  race: {
    select: {
      id: true,
    },
  },
  driver: {
    select: {
      id: true,
    },
  },
};

export const getAll = async () => {
  return prisma.result.findMany({
    select: RESULT_SELECT,
  });
};

export const getById = async (id: number) => {
  const result = await prisma.result.findUnique({
    where: {
      id,
    },
    select: RESULT_SELECT,
  });

  if (!result) {
    throw new Error('No result with this id exists');
  }

  return result;
};

export const create = async ({ position, points, status, race_id, driver_id }: any) => {
  return prisma.result.create({
    data: {
      position, 
      points, 
      status, 
      race_id, 
      driver_id,
    },
  });
};

export const updateById = async ( id: number, { position, points, status, race_id, driver_id }: any) => {
  return prisma.result.update({
    where: {
      id,
    },
    data: {
      position, 
      points, 
      status, 
      race_id, 
      driver_id,
    },
  });
};

export const deleteById = async (id: number) => {
  await prisma.result.delete({
    where: {
      id,
    },
  });
};

export const getResultsByRaceId = async (raceId: number) => {
  return prisma.result.findMany({
    where: {
      AND: [
        { race_id: raceId },
      ],
    },
    select: RESULT_SELECT,
  });
};

export const getResultsByDriverId = async (driverId: number) => {
  return prisma.result.findMany({
    where: {
      AND: [
        { driver_id: driverId },
      ],
    },
    select: RESULT_SELECT,
  });
};