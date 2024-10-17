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
import validate from '../core/validation';
import Joi from 'joi';

const getAllDrivers = async (ctx: KoaContext<GetAllDriversResponse>) => {
  const drivers = await driverService.getAll();
  ctx.body = {
    items: drivers,
  };
};

getAllDrivers.validationScheme = null;

const createDriver = async (ctx: KoaContext<CreateDriverResponse, void, CreateDriverRequest>) => {
  const newDriver = await driverService.create(ctx.request.body);
  ctx.status = 201;
  ctx.body = newDriver;
};

createDriver.validationScheme = {
  body: {
    first_name: Joi.string().max(255),
    last_name: Joi.string().max(255),
    status: Joi.string().max(255).optional(),
  },
};

const getDriverById = async (ctx: KoaContext<GetDriverByIdResponse, IdParams>) => {
  const driver = await driverService.getById(Number(ctx.params.id));
  ctx.body = driver;
};

getDriverById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const updateDriver = async (
  ctx: KoaContext<UpdateDriverResponse, IdParams, UpdateDriverRequest>,
) => {
  ctx.body = await driverService.updateById(Number(ctx.params.id), ctx.request.body);
};

updateDriver.validationScheme = {
  params: { id: Joi.number().integer().positive() },
  body: {
    first_name: Joi.string().max(255),
    last_name: Joi.string().max(255),
    status: Joi.string().max(255).optional(),
  },
};

const deleteDriver = async (ctx: KoaContext<void, IdParams>) => {
  await driverService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

deleteDriver.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const getResultsByDriverId = async(ctx: KoaContext<GetAllResultsResponse, IdParams>) => {
  const results = await resultService.getResultsByDriverId(
    Number(ctx.params.id),
  );
  ctx.body = {
    items: results,
  };
};

getResultsByDriverId.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<FormulaAppState, FormulaAppContext>({
    prefix: '/drivers',
  });

  router.get('/', validate(getAllDrivers.validationScheme), getAllDrivers);
  router.post('/', validate(createDriver.validationScheme), createDriver);
  router.get('/:id', validate(getDriverById.validationScheme), getDriverById);
  router.put('/:id', validate(updateDriver.validationScheme), updateDriver);
  router.delete('/:id', validate(deleteDriver.validationScheme), deleteDriver);
  router.get('/:id/results', validate(getResultsByDriverId.validationScheme), getResultsByDriverId);

  parent.use(router.routes()).use(router.allowedMethods());
};
