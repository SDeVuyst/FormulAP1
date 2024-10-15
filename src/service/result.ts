// src/service/transaction.ts
import { RESULTS } from '../data/mock_data';

export const getAll = () => {
  return RESULTS;
};

export const getById = (id: number) => {
  return RESULTS.find((r) => r.id === id);
};

export const create = ({ position, points, status, race_id, driver_id }: any) => {

  const maxId = Math.max(...RESULTS.map((i) => i.id));

  const newResult = {
    id: maxId + 1,
    position, points, status, race_id, driver_id,
  };

  RESULTS.push(newResult);
  return newResult;
};

export const updateById = (
  id: number,
  { position, points, status, race_id, driver_id }: any,
) => {
  // todo
  throw new Error('Not implemented yet!');
};

export const deleteById = (id: number) => {
  // todo
  throw new Error('Not implemented yet!');
};
