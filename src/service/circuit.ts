// src/service/circuit.ts
import { prisma } from '../data';
import type { Circuit, CircuitCreateInput, CircuitUpdateInput } from '../types/circuit';

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
    throw new Error('No circuit with this id exists');
  }

  return circuit;
};

export const create = async (circuit: CircuitCreateInput): Promise<Circuit> => {
  return await prisma.circuit.create({
    data: circuit,
  });
};

export const updateById = async ( 
  id: number,
  changes: CircuitUpdateInput,
): Promise<Circuit> => {
  return await prisma.circuit.update({
    where: {
      id,
    },
    data: changes,
    select: CIRCUIT_SELECT,
  });
};

export const deleteById = async (id: number): Promise<void> => {
  await prisma.circuit.delete({
    where: {
      id,
    },
  });
};
