// src/service/result.ts
import { prisma } from '../data';
import type { Result, ResultCreateInput, ResultUpdateInput } from '../types/result';

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

export const getAll = async (): Promise<Result[]> => {
  return await prisma.result.findMany({
    select: RESULT_SELECT,
  });
};

export const getById = async (id: number): Promise<Result> => {
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

export const create = async ({ 
  position, 
  points, 
  status, 
  race_id, 
  driver_id,
}: ResultCreateInput): Promise<Result> => {
  return await prisma.result.create({
    data: {
      position, 
      points, 
      status, 
      race_id: race_id, 
      driver_id: driver_id,
    },
    select: RESULT_SELECT,
  });
};

export const updateById = async ( id: number, { 
  position, 
  points, 
  status, 
  race_id, 
  driver_id,
}: ResultUpdateInput): Promise<Result> => {
  return await prisma.result.update({
    where: {
      id,
    },
    data: {
      position, 
      points, 
      status, 
      race_id: race_id, 
      driver_id: driver_id,
    },
    select: RESULT_SELECT,
  });
};

export const deleteById = async (id: number): Promise<void> => {
  await prisma.result.delete({
    where: {
      id,
    },
  });
};

export const getResultsByRaceId = async (race_id: number): Promise<Result[]> => {
  return await prisma.result.findMany({
    where: {
      AND: [
        { race_id: race_id },
      ],
    },
    select: RESULT_SELECT,
  });
};

export const getResultsByDriverId = async (driver_id: number): Promise<Result[]> => {
  return await prisma.result.findMany({
    where: {
      AND: [
        { driver_id: driver_id },
      ],
    },
    select: RESULT_SELECT,
  });
};