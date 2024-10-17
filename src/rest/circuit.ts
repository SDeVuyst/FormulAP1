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
import Joi from 'joi';
import validate from '../core/validation';

const getAllCircuits = async (ctx: KoaContext<GetAllCircuitsResponse>) => {
  const circuits = await circuitService.getAll();
  ctx.body = {
    items: circuits,
  };
};
getAllCircuits.validationScheme = null;

const createCircuit = async (ctx: KoaContext<CreateCircuitResponse, void, CreateCircuitRequest>) => {
  const newCircuit = await circuitService.create(ctx.request.body);
  ctx.status = 201;
  ctx.body = newCircuit;
};

createCircuit.validationScheme = {
  body: {
    name: Joi.string().max(255),
    city: Joi.string().max(255),
    country: Joi.string().max(255),
    active: Joi.boolean(),
  },
};

const getCircuitById = async (ctx: KoaContext<GetCircuitByIdResponse, IdParams>) => {
  const circuit = await circuitService.getById(ctx.params.id);
  ctx.body = circuit;
};

getCircuitById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const updateCircuit = async (
  ctx: KoaContext<UpdateCircuitResponse, IdParams, UpdateCircuitRequest>,
) => {
  ctx.body = await circuitService.updateById(Number(ctx.params.id), ctx.request.body);
};

updateCircuit.validationScheme = {
  params: { id: Joi.number().integer().positive() },
  body: {
    name: Joi.string().max(255),
    city: Joi.string().max(255),
    country: Joi.string().max(255),
    active: Joi.boolean(),
  },
};

const deleteCircuit = async (ctx: KoaContext<void, IdParams>) => {
  await circuitService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

deleteCircuit.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const getRacesByCircuitId = async(ctx: KoaContext<GetAllRacesResponse, IdParams>) => {
  const races = await raceService.getRacesByCircuitId(
    Number(ctx.params.id),
  );
  ctx.body = {
    items: races,
  };
};

getRacesByCircuitId.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<FormulaAppState, FormulaAppContext>({
    prefix: '/circuits',
  });

  router.get('/', validate(getAllCircuits.validationScheme), getAllCircuits);
  router.post('/', validate(createCircuit.validationScheme), createCircuit);
  router.get('/:id', validate(getCircuitById.validationScheme), getCircuitById);
  router.put('/:id', validate(updateCircuit.validationScheme), updateCircuit);
  router.delete('/:id', validate(deleteCircuit.validationScheme), deleteCircuit);
  router.get('/:id/races', validate(getRacesByCircuitId.validationScheme), getRacesByCircuitId);

  parent.use(router.routes()).use(router.allowedMethods());
};
