import Router from '@koa/router';
import * as raceService from '../service/race';
import * as resultService from '../service/result';
import type { Context } from 'koa';

const getAllRaces = async (ctx: Context) => {
  ctx.body = {
    items: raceService.getAll(),
  };
};

const createRace = async (ctx: Context) => {
  const newTransaction = raceService.create({
    ...ctx.request.body,
    placeId: Number(ctx.request.body.placeId),
    date: new Date(ctx.request.body.date),
  });
  ctx.body = newTransaction;
};

const getRaceById = async (ctx: Context) => {
  ctx.body = raceService.getById(Number(ctx.params.id));
};

const updateRace = async (ctx: Context) => {
  ctx.body = raceService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
    placeId: Number(ctx.request.body.placeId),
    date: new Date(ctx.request.body.date),
  });
};

const deleteRace = async (ctx: Context) => {
  raceService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

const getResultsByRaceId = async(ctx: Context) => {
  const results = await resultService.getResultsByRaceId(
    Number(ctx.params.id),
  );
  ctx.body = {
    items: results,
  };
};

export default (parent: Router) => {
  const router = new Router({
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
