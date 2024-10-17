// src/service/circuit.ts
import ServiceError from '../core/serviceError';
import { prisma } from '../data';
import type { Circuit, CircuitCreateInput, CircuitUpdateInput } from '../types/circuit';
import handleDBError from './_handleDBError';

const CIRCUIT_SELECT = {
  id: true,
  name: true,
  city: true,
  country: true,
  active: true,
};

export const getAll = async (): Promise<Circuit[]> => {
  return await prisma.circuit.findMany({
    select: CIRCUIT_SELECT,
  });
};

export const getById = async (id: number): Promise<Circuit> => {
  const circuit = await prisma.circuit.findUnique({
    where: {
      id,
    },
    select: CIRCUIT_SELECT,
  });

  if (!circuit) {
    throw ServiceError.notFound('No circuit with this id exists');
  }

  return circuit;
};

export const create = async (circuit: CircuitCreateInput): Promise<Circuit> => {
  try {
    return await prisma.circuit.create({
      data: circuit,
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const updateById = async ( 
  id: number,
  changes: CircuitUpdateInput,
): Promise<Circuit> => {
  try {
    return await prisma.circuit.update({
      where: {
        id,
      },
      data: changes,
      select: CIRCUIT_SELECT,
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number): Promise<void> => {
  try {
    await prisma.circuit.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const checkCircuitExists = async (id: number) => {
  const count = await prisma.circuit.count({
    where: {
      id,
    },
  });

  if (count === 0) {
    throw ServiceError.notFound('No circuit with this id exists');
  }
};
