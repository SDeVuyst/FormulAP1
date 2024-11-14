// src/service/result.ts
import ServiceError from '../core/serviceError';
import { prisma } from '../data';
import type { Result, ResultCreateInput, ResultUpdateInput } from '../types/result';
import handleDBError from './_handleDBError';
import * as raceService from './race';
import * as driverService from './driver';

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
  car: {
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
    throw ServiceError.notFound('No result with this id exists');
  }

  return result;
};

export const create = async ({ 
  position, 
  points, 
  status, 
  race_id, 
  driver_id,
  car_id,
}: ResultCreateInput): Promise<Result> => {
  try {

    await raceService.checkRaceExists(race_id);
    await driverService.checkDriverExists(driver_id);

    return await prisma.result.create({
      data: {
        position, 
        points, 
        status, 
        race_id: race_id, 
        driver_id: driver_id,
        car_id: car_id,
      },
      select: RESULT_SELECT,
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const updateById = async ( id: number, { 
  position, 
  points, 
  status, 
  race_id, 
  driver_id,
  car_id,
}: ResultUpdateInput): Promise<Result> => {
  try {
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
        car_id: car_id,
      },
      select: RESULT_SELECT,
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number): Promise<void> => {
  try {
    await prisma.result.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    throw handleDBError(error);
  }
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

export const getResultsByCarId = async (car_id: number): Promise<Result[]> => {
  return await prisma.result.findMany({
    where: {
      AND: [
        { car_id: car_id },
      ],
    },
    select: RESULT_SELECT,
  });
};