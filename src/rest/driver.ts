import Router from '@koa/router';
import * as driverService from '../service/driver';
import * as resultService from '../service/result';
import type { Context } from 'koa';

const getAllDrivers = async (ctx: Context) => {
  ctx.body = {
    items: driverService.getAll(),
  };
};

const createDriver = async (ctx: Context) => {
  const newTransaction = driverService.create({
    ...ctx.request.body,
    placeId: Number(ctx.request.body.placeId),
    date: new Date(ctx.request.body.date),
  });
  ctx.body = newTransaction;
};

const getDriverById = async (ctx: Context) => {
  ctx.body = driverService.getById(Number(ctx.params.id));
};

const updateDriver = async (ctx: Context) => {
  ctx.body = driverService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
    placeId: Number(ctx.request.body.placeId),
    date: new Date(ctx.request.body.date),
  });
};

const deleteDriver = async (ctx: Context) => {
  driverService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

const getResultsByDriverId = async(ctx: Context) => {
  const results = await resultService.getResultsByDriverId(
    Number(ctx.params.id),
  );
  ctx.body = {
    items: results,
  };
};

export default (parent: Router) => {
  const router = new Router({
    prefix: '/drivers',
  });

  router.get('/', getAllDrivers);
  router.post('/', createDriver);
  router.get('/:id', getDriverById);
  router.put('/:id', updateDriver);
  router.delete('/:id', deleteDriver);
  router.get('/:id/results', getResultsByDriverId);

  parent.use(router.routes()).use(router.allowedMethods());
};
