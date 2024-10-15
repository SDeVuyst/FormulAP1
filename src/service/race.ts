// src/service/transaction.ts
import { RACES } from '../data/mock_data';

export const getAll = () => {
  return RACES;
};

export const getById = (id: number) => {
  return RACES.find((r) => r.id === id);
};

export const create = ({ date, laps, circuit_id }: any) => {

  const maxId = Math.max(...RACES.map((i) => i.id));

  const newRace = {
    id: maxId + 1,
    date, laps, circuit_id,
  };

  RACES.push(newRace);
  return newRace;
};

export const updateById = (
  id: number,
  { date, laps, circuit_id }: any,
) => {
  // todo
  throw new Error('Not implemented yet!');
};

export const deleteById = (id: number) => {
  // todo
  throw new Error('Not implemented yet!');
};
