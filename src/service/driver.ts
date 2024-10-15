// src/service/transaction.ts
import { DRIVERS } from '../data/mock_data';

export const getAll = () => {
  return DRIVERS;
};

export const getById = (id: number) => {
  return DRIVERS.find((d) => d.id === id);
};

export const create = ({ first_name, last_name, status }: any) => {

  const maxId = Math.max(...DRIVERS.map((i) => i.id));

  const newDriver = {
    id: maxId + 1, // 👈 2
    first_name,
    last_name,
    status,
  };

  DRIVERS.push(newDriver); // 👈 4
  return newDriver; // 👈 5
};

export const updateById = (
  id: number,
  { first_name, last_name, status }: any,
) => {
  // todo
  throw new Error('Not implemented yet!');
};

export const deleteById = (id: number) => {
  // todo
  throw new Error('Not implemented yet!');
};
