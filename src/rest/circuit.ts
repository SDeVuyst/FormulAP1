import Router from '@koa/router';
import * as circuitService from '../service/circuit';
import * as raceService from '../service/race';
import type { Context } from 'koa';

const getAllCircuits = async (ctx: Context) => {
  ctx.body = {
    items: circuitService.getAll(),
  };
};

const createCircuit = async (ctx: Context) => {
  const newTransaction = circuitService.create({
    ...ctx.request.body,
    placeId: Number(ctx.request.body.placeId),
    date: new Date(ctx.request.body.date),
  });
  ctx.body = newTransaction;
};

const getCircuitById = async (ctx: Context) => {
  ctx.body = circuitService.getById(Number(ctx.params.id));
};

const updateCircuit = async (ctx: Context) => {
  ctx.body = circuitService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
    placeId: Number(ctx.request.body.placeId),
    date: new Date(ctx.request.body.date),
  });
};

const deleteCircuit = async (ctx: Context) => {
  circuitService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

const getRacesByCircuitId = async(ctx: Context) => {
  const races = await raceService.getRacesByCircuitId(
    Number(ctx.params.id),
  );
  ctx.body = {
    items: races,
  };
};

export default (parent: Router) => {
  const router = new Router({
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
