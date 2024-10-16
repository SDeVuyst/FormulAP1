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

const getAllRaces = async (ctx: KoaContext<GetAllRacesResponse>) => {
  const races = await raceService.getAll();
  ctx.body = {
    items: races,
  };
};

const createRace = async (ctx: KoaContext<CreateRaceResponse, void, CreateRaceRequest>) => {
  const newRace = await raceService.create(ctx.request.body);
  ctx.status = 201;
  ctx.body = newRace;
};

const getRaceById = async (ctx: KoaContext<GetRaceByIdResponse, IdParams>) => {
  const race = await raceService.getById(Number(ctx.params.id));
  ctx.body = race;
};

const updateRace = async (
  ctx: KoaContext<UpdateRaceResponse, IdParams, UpdateRaceRequest>,
) => {
  ctx.body = await raceService.updateById(ctx.params.id, ctx.request.body);
};

const deleteRace = async (ctx: KoaContext<void, IdParams>) => {
  await raceService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

const getResultsByRaceId = async(ctx: KoaContext<GetAllResultsResponse, IdParams>) => {
  const results = await resultService.getResultsByRaceId(
    Number(ctx.params.id),
  );
  ctx.body = {
    items: results,
  };
};

export default (parent: KoaRouter) => {
  const router = new Router<FormulaAppState, FormulaAppContext>({
    prefix: '/races',
  });

  router.get('/', getAllRaces);
  router.post('/', createRace);
  router.get('/:id', getRaceById);
  router.put('/:id', updateRace);
  router.delete('/:id', deleteRace);
  router.get('/:id/results', getResultsByRaceId);

  parent.use(router.routes()).use(router.allowedMethods());
};
