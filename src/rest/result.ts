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

const getAllResults = async (ctx: KoaContext<GetAllResultsResponse>) => {
  const results = await resultService.getAll();
  ctx.body = {
    items: results,
  };
};

const createResult = async (ctx: KoaContext<CreateResultResponse, void, CreateResultRequest>) => {
  const newResult = await resultService.create(ctx.request.body);
  ctx.status = 201;
  ctx.body = newResult;
};

const getResultById = async (ctx: KoaContext<GetResultByIdResponse, IdParams>) => {
  const result = await resultService.getById(Number(ctx.params.id));
  ctx.body = result;
};

const updateResult = async (
  ctx: KoaContext<UpdateResultResponse, IdParams, UpdateResultRequest>,
) => {
  ctx.body = await resultService.updateById(Number(ctx.params.id), ctx.request.body);
};

const deleteResult = async (ctx: KoaContext<void, IdParams>) => {
  await resultService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

export default (parent: KoaRouter) => {
  const router = new Router<FormulaAppState, FormulaAppContext>({
    prefix: '/results',
  });

  router.get('/', getAllResults);
  router.post('/', createResult);
  router.get('/:id', getResultById);
  router.put('/:id', updateResult);
  router.delete('/:id', deleteResult);

  parent.use(router.routes()).use(router.allowedMethods());
};
