// src/service/transaction.ts
import { CIRCUITS } from '../data/mock_data';

export const getAll = () => {
  return CIRCUITS;
};

export const getById = (id: number) => {
  return CIRCUITS.find((c) => c.id === id);
};

export const create = ({ name, city, country, active }: any) => {

  const maxId = Math.max(...CIRCUITS.map((i) => i.id));

  const newCircuit = {
    id: maxId + 1,
    name, city, country, active,
  };

  CIRCUITS.push(newCircuit);
  return newCircuit;
};

export const updateById = (
  id: number,
  { name, city, country, active }: any,
) => {
  // todo
  throw new Error('Not implemented yet!');
};

export const deleteById = (id: number) => {
  // todo
  throw new Error('Not implemented yet!');
};
