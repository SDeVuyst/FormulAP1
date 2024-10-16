// src/service/driver.ts
import { prisma } from '../data';

const DRIVER_SELECT = {
  id: true,
  first_name: true,
  last_name: true,
  status: true,
};

export const getAll = async () => {
  return prisma.driver.findMany({
    select: DRIVER_SELECT,
  });
};

export const getById = async (id: number) => {
  const driver = await prisma.circuit.findUnique({
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

export const create = async ({ first_name, last_name, status }: any) => {
  return prisma.driver.create({
    data: {
      first_name, 
      last_name, 
      status,
    },
  });
};

export const updateById = async ( id: number, { first_name, last_name, status }: any,
) => {
  return prisma.driver.update({
    where: {
      id,
    },
    data: {
      first_name,
      last_name,
      status,
    },
  });
};

export const deleteById = async (id: number) => {
  await prisma.driver.delete({
    where: {
      id,
    },
  });
};
