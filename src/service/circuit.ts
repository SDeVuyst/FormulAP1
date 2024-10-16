// src/service/circuit.ts
import { prisma } from '../data';

const CIRCUIT_SELECT = {
  id: true,
  name: true,
  city: true,
  country: true,
  active: true,
};

export const getAll = async () => {
  return prisma.circuit.findMany({
    select: CIRCUIT_SELECT,
  });
};

export const getById = async (id: number) => {
  const circuit = await prisma.circuit.findUnique({
    where: {
      id,
    },
    select: CIRCUIT_SELECT,
  });

  if (!circuit) {
    throw new Error('No circuit with this id exists');
  }

  return circuit;
};

export const create = async ({ name, city, country, active }: any) => {
  return prisma.circuit.create({
    data: {
      name,
      city,
      country,
      active,
    },
  });
};

export const updateById = async ( id: number, { name, city, country, active }: any) => {
  return prisma.circuit.update({
    where: {
      id,
    },
    data: {
      name,
      city,
      country,
      active,
    },
  });
};

export const deleteById = async (id: number) => {
  await prisma.circuit.delete({
    where: {
      id,
    },
  });
};
