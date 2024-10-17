// src/service/driver.ts
import ServiceError from '../core/serviceError';
import { prisma } from '../data';
import type { Driver, DriverCreateInput, DriverUpdateInput } from '../types/driver';
import handleDBError from './_handleDBError';

const DRIVER_SELECT = {
  id: true,
  first_name: true,
  last_name: true,
  status: true,
};

export const getAll = async (): Promise<Driver[]> => {
  return await prisma.driver.findMany({
    select: DRIVER_SELECT,
  });
};

export const getById = async (id: number): Promise<Driver> => {
  const driver = await prisma.driver.findUnique({
    where: {
      id,
    },
    select: DRIVER_SELECT,
  });

  if (!driver) {
    throw ServiceError.notFound('No driver with this id exists');
  }

  return driver;
};

export const create = async (driver: DriverCreateInput): Promise<Driver> => {
  try {
    return await prisma.driver.create({
      data: driver,
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const updateById = async ( 
  id: number, 
  changes: DriverUpdateInput,
): Promise<Driver> => {
  try {
    return await prisma.driver.update({
      where: {
        id,
      },
      data: changes,
      select: DRIVER_SELECT,
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number): Promise<void> => {
  try {
    await prisma.driver.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const checkDriverExists = async (id: number) => {
  const count = await prisma.driver.count({
    where: {
      id,
    },
  });

  if (count === 0) {
    throw ServiceError.notFound('No driver with this id exists');
  }
};
