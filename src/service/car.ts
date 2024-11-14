// src/service/car.ts
import ServiceError from '../core/serviceError';
import { prisma } from '../data';
import type { Car, CarCreateInput, CarUpdateInput } from '../types/car';
import handleDBError from './_handleDBError';

const CAR_SELECT = {
  id: true,
  model: true,
  weight: true,
  year: true,
  team: {
    select: {
      id: true,
      name: true,
    },
  },
};

export const getAll = async (): Promise<Car[]> => {
  return await prisma.car.findMany({
    select: CAR_SELECT,
  });
};

export const getById = async (id: number): Promise<Car> => {
  const car = await prisma.car.findUnique({
    where: {
      id,
    },
    select: CAR_SELECT,
  });

  if (!car) {
    throw ServiceError.notFound('No car with this id exists');
  }

  return car;
};

export const create = async ({
  model,
  weight,
  year,
  team_id,
}: CarCreateInput): Promise<Car> => {
  try {
    return await prisma.car.create({
      data: {
        model, 
        weight,
        year, 
        team_id: team_id,
      },
      select: CAR_SELECT,
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const updateById = async ( 
  id: number,
  changes: CarUpdateInput,
): Promise<Car> => {
  try {
    return await prisma.car.update({
      where: {
        id,
      },
      data: changes,
      select: CAR_SELECT,
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number): Promise<void> => {
  try {
    await prisma.car.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const checkCarExists = async (id: number) => {
  const count = await prisma.car.count({
    where: {
      id,
    },
  });

  if (count === 0) {
    throw ServiceError.notFound('No car with this id exists');
  }
};

export const getCarsByTeamId = async (team_id: number): Promise<Car[]> => {
  return await prisma.car.findMany({
    where: {
      AND: [
        { team_id: team_id },
      ],
    },
    select: CAR_SELECT,
  });
};
