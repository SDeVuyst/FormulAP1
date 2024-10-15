// src/service/transaction.ts
import { RACES } from '../data/mock_data';

export const getAll = () => {
  return RACES;
};

export const getById = (id: number) => {
  return RACES.find((r) => r.id === id);
};

export const create = ({ date, laps, circuit }: any) => {

  const maxId = Math.max(...RACES.map((i) => i.id));

  const newRace = {
    id: maxId + 1,
    date, laps, circuit,
  };

  RACES.push(newRace);
  return newRace;
};

export const updateById = (
  id: number,
  { date, laps, circuit }: any,
) => {
  // todo
  throw new Error('Not implemented yet!');
};

export const deleteById = (id: number) => {
  // todo
  throw new Error('Not implemented yet!');
};

export const getRacesByCircuitId = async (circuitId: number) => {
  return RACES.filter((r) => r.circuit.id === circuitId);
};