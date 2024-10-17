import Router from '@koa/router';
import * as raceService from '../service/race';
import * as resultService from '../service/result';
import type { FormulaAppContext, FormulaAppState, KoaContext, KoaRouter } from '../types/koa';
import type { 
  CreateRaceRequest, 
  CreateRaceResponse, 
  GetAllRacesResponse, 
  GetRaceByIdResponse, 
  UpdateRaceRequest, 
  UpdateRaceResponse,
} from '../types/race';
import type { IdParams } from '../types/common';
import type { GetAllResultsResponse } from '../types/result';
import validate from '../core/validation';
import Joi from 'joi';

const getAllRaces = async (ctx: KoaContext<GetAllRacesResponse>) => {
  const races = await raceService.getAll();
  ctx.body = {
    items: races,
  };
};
getAllRaces.validationScheme = null;

const createRace = async (ctx: KoaContext<CreateRaceResponse, void, CreateRaceRequest>) => {
  const newRace = await raceService.create(ctx.request.body);
  ctx.status = 201;
  ctx.body = newRace;
};

createRace.validationScheme = {
  body: {
    date: Joi.date().iso(),
    laps: Joi.number().integer().positive(),
    circuit_id: Joi.number().integer().positive(),
  },
};

const getRaceById = async (ctx: KoaContext<GetRaceByIdResponse, IdParams>) => {
  const race = await raceService.getById(Number(ctx.params.id));
  ctx.body = race;
};

getRaceById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const updateRace = async (
  ctx: KoaContext<UpdateRaceResponse, IdParams, UpdateRaceRequest>,
) => {
  ctx.body = await raceService.updateById(Number(ctx.params.id), ctx.request.body);
};

updateRace.validationScheme = {
  params: { id: Joi.number().integer().positive() },
  body: {
    date: Joi.date().iso(),
    laps: Joi.number().integer().positive(),
    circuit_id: Joi.number().integer().positive(),
  },
};

const deleteRace = async (ctx: KoaContext<void, IdParams>) => {
  await raceService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

deleteRace.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const getResultsByRaceId = async(ctx: KoaContext<GetAllResultsResponse, IdParams>) => {
  const results = await resultService.getResultsByRaceId(
    Number(ctx.params.id),
  );
  ctx.body = {
    items: results,
  };
};

getResultsByRaceId.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<FormulaAppState, FormulaAppContext>({
    prefix: '/races',
  });

  router.get('/', validate(getAllRaces.validationScheme), getAllRaces);
  router.post('/', validate(createRace.validationScheme), createRace);
  router.get('/:id', validate(getRaceById.validationScheme), getRaceById);
  router.put('/:id', validate(updateRace.validationScheme), updateRace);
  router.delete('/:id', validate(deleteRace.validationScheme), deleteRace);
  router.get('/:id/results', validate(getResultsByRaceId.validationScheme), getResultsByRaceId);

  parent.use(router.routes()).use(router.allowedMethods());
};
