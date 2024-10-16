import Router from '@koa/router';
import * as circuitService from '../service/circuit';
import * as raceService from '../service/race';
import type { FormulaAppContext, FormulaAppState, KoaContext, KoaRouter } from '../types/koa';
import type { 
  CreateCircuitRequest, 
  CreateCircuitResponse, 
  GetAllCircuitsResponse, 
  GetCircuitByIdResponse,
  UpdateCircuitRequest,
  UpdateCircuitResponse,
} from '../types/circuit';
import type {
  GetAllRacesResponse,
} from '../types/race';
import type { IdParams } from '../types/common';

const getAllCircuits = async (ctx: KoaContext<GetAllCircuitsResponse>) => {
  const circuits = await circuitService.getAll();
  ctx.body = {
    items: circuits,
  };
};

const createCircuit = async (ctx: KoaContext<CreateCircuitResponse, void, CreateCircuitRequest>) => {
  const newCircuit = await circuitService.create(ctx.request.body);
  ctx.status = 201;
  ctx.body = newCircuit;
};

const getCircuitById = async (ctx: KoaContext<GetCircuitByIdResponse, IdParams>) => {
  const circuit = await circuitService.getById(Number(ctx.params.id));
  ctx.body = circuit;
};

const updateCircuit = async (
  ctx: KoaContext<UpdateCircuitResponse, IdParams, UpdateCircuitRequest>,
) => {
  ctx.body = await circuitService.updateById(Number(ctx.params.id), ctx.request.body);
};

const deleteCircuit = async (ctx: KoaContext<void, IdParams>) => {
  await circuitService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

const getRacesByCircuitId = async(ctx: KoaContext<GetAllRacesResponse, IdParams>) => {
  const races = await raceService.getRacesByCircuitId(
    Number(ctx.params.id),
  );
  ctx.body = {
    items: races,
  };
};

export default (parent: KoaRouter) => {
  const router = new Router<FormulaAppState, FormulaAppContext>({
    prefix: '/circuits',
  });

  router.get('/', getAllCircuits);
  router.post('/', createCircuit);
  router.get('/:id', getCircuitById);
  router.put('/:id', updateCircuit);
  router.delete('/:id', deleteCircuit);
  router.get('/:id/races', getRacesByCircuitId);

  parent.use(router.routes()).use(router.allowedMethods());
};
