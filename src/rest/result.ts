import Router from '@koa/router';
import * as resultService from '../service/result';
import type { Context } from 'koa';

const getAllResults = async (ctx: Context) => {
  const results = await resultService.getAll();
  ctx.body = {
    items: results,
  };
};

const createResult = async (ctx: Context) => {
  const newTransaction = await resultService.create({
    ...ctx.request.body,
    placeId: Number(ctx.request.body.placeId),
    date: new Date(ctx.request.body.date),
  });
  ctx.body = newTransaction;
};

const getResultById = async (ctx: Context) => {
  const result = await resultService.getById(Number(ctx.params.id));
  ctx.body = result;
};

const updateResult = async (ctx: Context) => {
  ctx.body = await resultService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
    placeId: Number(ctx.request.body.placeId),
    date: new Date(ctx.request.body.date),
  });
};

const deleteResult = async (ctx: Context) => {
  await resultService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

export default (parent: Router) => {
  const router = new Router({
    prefix: '/results',
  });

  router.get('/', getAllResults);
  router.post('/', createResult);
  router.get('/:id', getResultById);
  router.put('/:id', updateResult);
  router.delete('/:id', deleteResult);

  parent.use(router.routes()).use(router.allowedMethods());
};
