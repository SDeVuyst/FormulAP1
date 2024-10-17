import Router from '@koa/router';
import * as resultService from '../service/result';
import type { FormulaAppContext, FormulaAppState, KoaContext, KoaRouter } from '../types/koa';
import type { 
  CreateResultRequest, 
  CreateResultResponse, 
  GetAllResultsResponse, 
  GetResultByIdResponse, 
  UpdateResultRequest, 
  UpdateResultResponse,
} from '../types/result';
import type { IdParams } from '../types/common';
import validate from '../core/validation';
import Joi from 'joi';

const getAllResults = async (ctx: KoaContext<GetAllResultsResponse>) => {
  const results = await resultService.getAll();
  ctx.body = {
    items: results,
  };
};
getAllResults.validationScheme = null;

const createResult = async (ctx: KoaContext<CreateResultResponse, void, CreateResultRequest>) => {
  const newResult = await resultService.create(ctx.request.body);
  ctx.status = 201;
  ctx.body = newResult;
};

createResult.validationScheme = {
  body: {
    position: Joi.number().integer().positive(),
    points: Joi.number().integer(),
    status: Joi.string().max(255).optional(),
    race_id: Joi.number().integer().positive(),
    driver_id: Joi.number().integer().positive(),
  },
};

const getResultById = async (ctx: KoaContext<GetResultByIdResponse, IdParams>) => {
  const result = await resultService.getById(Number(ctx.params.id));
  ctx.body = result;
};

getResultById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const updateResult = async (
  ctx: KoaContext<UpdateResultResponse, IdParams, UpdateResultRequest>,
) => {
  ctx.body = await resultService.updateById(Number(ctx.params.id), ctx.request.body);
};

updateResult.validationScheme = {
  params: { id: Joi.number().integer().positive() },
  body: {
    position: Joi.number().integer().positive(),
    points: Joi.number().integer(),
    status: Joi.string().max(255).optional(),
    race_id: Joi.number().integer().positive(),
    driver_id: Joi.number().integer().positive(),
  },
};

const deleteResult = async (ctx: KoaContext<void, IdParams>) => {
  await resultService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

deleteResult.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<FormulaAppState, FormulaAppContext>({
    prefix: '/results',
  });

  router.get('/', validate(getAllResults.validationScheme), getAllResults);
  router.post('/', validate(createResult.validationScheme), createResult);
  router.get('/:id', validate(getResultById.validationScheme), getResultById);
  router.put('/:id', validate(updateResult.validationScheme), updateResult);
  router.delete('/:id', validate(deleteResult.validationScheme), deleteResult);

  parent.use(router.routes()).use(router.allowedMethods());
};
