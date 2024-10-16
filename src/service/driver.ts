// src/service/driver.ts
import { prisma } from '../data';
import type { Driver, DriverCreateInput, DriverUpdateInput } from '../types/driver';

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
    throw new Error('No driver with this id exists');
  }

  return driver;
};

export const create = async (driver: DriverCreateInput): Promise<Driver> => {
  return await prisma.driver.create({
    data: driver,
  });
};

export const updateById = async ( 
  id: number, 
  changes: DriverUpdateInput,
): Promise<Driver> => {
  return await prisma.driver.update({
    where: {
      id,
    },
    data: changes,
    select: DRIVER_SELECT,
  });
};

export const deleteById = async (id: number): Promise<void> => {
  await prisma.driver.delete({
    where: {
      id,
    },
  });
};
