// src/service/transaction.ts
import { RESULTS } from '../data/mock_data';

export const getAll = () => {
  return RESULTS;
};

export const getById = (id: number) => {
  return RESULTS.find((r) => r.id === id);
};

export const create = ({ position, points, status, race, driver }: any) => {

  const maxId = Math.max(...RESULTS.map((i) => i.id));

  const newResult = {
    id: maxId + 1,
    position, points, status, race, driver,
  };

  RESULTS.push(newResult);
  return newResult;
};

export const updateById = (
  id: number,
  { position, points, status, race, driver }: any,
) => {
  // todo
  throw new Error('Not implemented yet!');
};

export const deleteById = (id: number) => {
  // todo
  throw new Error('Not implemented yet!');
};

export const getResultsByRaceId = async (raceId: number) => {
  return RESULTS.filter((r) => r.race.id === raceId);
};

export const getResultsByDriverId = async (driverId: number) => {
  return RESULTS.filter((r) => r.driver.id === driverId);
};