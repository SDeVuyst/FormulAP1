import Router from '@koa/router';
import * as RaceService from '../service/race';
import type { Context } from 'koa';

const getAllRaces = async (ctx: Context) => {
  ctx.body = {
    items: RaceService.getAll(),
  };
};

const createRace = async (ctx: Context) => {
  const newTransaction = RaceService.create({
    ...ctx.request.body,
    placeId: Number(ctx.request.body.placeId),
    date: new Date(ctx.request.body.date),
  });
  ctx.body = newTransaction;
};

const getRaceById = async (ctx: Context) => {
  ctx.body = RaceService.getById(Number(ctx.params.id));
};

const updateRace = async (ctx: Context) => {
  ctx.body = RaceService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
    placeId: Number(ctx.request.body.placeId),
    date: new Date(ctx.request.body.date),
  });
};

const deleteRace = async (ctx: Context) => {
  RaceService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
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

  parent.use(router.routes()).use(router.allowedMethods());
};
