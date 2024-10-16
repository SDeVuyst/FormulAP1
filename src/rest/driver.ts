import Router from '@koa/router';
import * as driverService from '../service/driver';
import * as resultService from '../service/result';
import type { FormulaAppContext, FormulaAppState, KoaContext, KoaRouter } from '../types/koa';
import type { 
  CreateDriverRequest, 
  CreateDriverResponse, 
  GetAllDriversResponse, 
  GetDriverByIdResponse,
  UpdateDriverRequest,
  UpdateDriverResponse,
} from '../types/driver';
import type { IdParams } from '../types/common';
import type { GetAllResultsResponse } from '../types/result';

const getAllDrivers = async (ctx: KoaContext<GetAllDriversResponse>) => {
  const drivers = await driverService.getAll();
  ctx.body = {
    items: drivers,
  };
};

const createDriver = async (ctx: KoaContext<CreateDriverResponse, void, CreateDriverRequest>) => {
  const newDriver = await driverService.create(ctx.request.body);
  ctx.status = 201;
  ctx.body = newDriver;
};

const getDriverById = async (ctx: KoaContext<GetDriverByIdResponse, IdParams>) => {
  const driver = await driverService.getById(Number(ctx.params.id));
  ctx.body = driver;
};

const updateDriver = async (
  ctx: KoaContext<UpdateDriverResponse, IdParams, UpdateDriverRequest>,
) => {
  ctx.body = await driverService.updateById(Number(ctx.params.id), ctx.request.body);
};

const deleteDriver = async (ctx: KoaContext<void, IdParams>) => {
  await driverService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

const getResultsByDriverId = async(ctx: KoaContext<GetAllResultsResponse, IdParams>) => {
  const results = await resultService.getResultsByDriverId(
    Number(ctx.params.id),
  );
  ctx.body = {
    items: results,
  };
};

export default (parent: KoaRouter) => {
  const router = new Router<FormulaAppState, FormulaAppContext>({
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
