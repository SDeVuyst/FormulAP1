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
import { requireAuthentication, makeRequireRole } from '../core/auth';
import Role from '../core/roles';

/**
 * @api {get} /api/results Get all results
 * @apiName GetResuls
 * @apiGroup Result
 * 
 * @apiSuccess {Result[]} results List of results.
 * 
 * @apiError (400) BadRequest This route does not accept any arguments.
 * @apiError (401) Unauthorized No authorization token provided
 * @apiError (401) Unauthorized Invalid authorization token provided
 */
const getAllResults = async (ctx: KoaContext<GetAllResultsResponse>) => {
  const { roles } = ctx.state.session;
  let results;

  if (roles.includes(Role.ADMIN)) {
    results = await resultService.getAll();
  } else {
    results = await resultService.getResultsByDriverId(Number(ctx.state.session.userId));
  }
  
  ctx.body = {
    items: results,
  };
};
getAllResults.validationScheme = null;

/**
 * @api {post} /api/results/ Create new result
 * @apiName CreateResult
 * @apiGroup Result
 * 
 * @apiBody {Int} position Finishing position.
 * @apiBody {Int} points Amount of points rewarded.
 * @apiBody {String} [status] Status of Result eg. FIN, DQ.
 * @apiBody {Int} race_id Race ID.
 * @apiBody {Int} driver_id Driver ID.
 * 
 * @apiSuccess {Int} id Result ID.
 * @apiSuccess {Int} position Finishing position.
 * @apiSuccess {Int} points Amount of points rewarded.
 * @apiSuccess {String} [status] Status of Result eg. FIN, DQ.
 * @apiSuccess {Int} race.id Race ID.
 * @apiSuccess {Int} driver.id Driver ID.
 * 
 * @apiError (404) NotFound No race with this id exists.
 * @apiError (400) BadRequest Invalid race id.
 * @apiError (401) Unauthorized No authorization token provided
 * @apiError (401) Unauthorized Invalid authorization token provided
 */
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

/**
 * @api {get} /api/results/:id Get result by Id
 * @apiName GetResultById
 * @apiGroup Result
 * 
 * @apiParam {Int} id Result ID.
 * 
 * @apiSuccess {Int} id Result ID.
 * @apiSuccess {Int} position Finishing position.
 * @apiSuccess {Int} points Amount of points rewarded.
 * @apiSuccess {String} [status] Status of Result eg. FIN, DQ.
 * @apiSuccess {Int} race.id Race ID.
 * @apiSuccess {Int} driver.id Driver ID.
 * 
 * @apiError (404) NotFound No race with this id exists.
 * @apiError (400) BadRequest Invalid race id.
 * @apiError (401) Unauthorized No authorization token provided
 * @apiError (401) Unauthorized Invalid authorization token provided
 */
const getResultById = async (ctx: KoaContext<GetResultByIdResponse, IdParams>) => {
  const result = await resultService.getById(Number(ctx.params.id));
  ctx.body = result;
};

getResultById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @api {put} /api/results/:id Update result by Id
 * @apiName UpdateResultById
 * @apiGroup Result
 * 
 * @apiParam {Int} id Result ID.
 * 
 * @apiBody {Int} position Finishing position.
 * @apiBody {Int} points Amount of points rewarded.
 * @apiBody {String} [status] Status of Result eg. FIN, DQ.
 * @apiBody {Int} race_id Race ID.
 * @apiBody {Int} driver_id Driver ID.
 * 
 * @apiSuccess {Int} id Result ID.
 * @apiSuccess {Int} position Finishing position.
 * @apiSuccess {Int} points Amount of points rewarded.
 * @apiSuccess {String} [status] Status of Result eg. FIN, DQ.
 * @apiSuccess {Int} race.id Race ID.
 * @apiSuccess {Int} driver.id Driver ID.
 * 
 * @apiError (404) NotFound No race with this id exists.
 * @apiError (400) BadRequest Invalid race id.
 * @apiError (401) Unauthorized No authorization token provided
 * @apiError (401) Unauthorized Invalid authorization token provided
 */
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

/**
 * @api {delete} /api/results/:id Delete result
 * @apiName DeleteRace
 * @apiGroup Result
 * 
 * @apiParam {Int} id Results unique ID (URL parameter).
 * 
 * @apiSuccess (204) NoContent The result was successfully deleted and no content is returned.
 * 
 * @apiError (404) NotFound No result with this id exists.
 * @apiError (401) Unauthorized No authorization token provided
 * @apiError (401) Unauthorized Invalid authorization token provided
 */
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

  router.use(requireAuthentication);
  const requireAdmin = makeRequireRole(Role.ADMIN);

  router.get(
    '/', 
    validate(getAllResults.validationScheme), 
    getAllResults,
  );

  router.post(
    '/', 
    requireAdmin,
    validate(createResult.validationScheme), 
    createResult,
  );

  router.get(
    '/:id', 
    validate(getResultById.validationScheme), 
    getResultById,
  );

  router.put(
    '/:id', 
    requireAdmin,
    validate(updateResult.validationScheme), 
    updateResult,
  );

  router.delete(
    '/:id', 
    requireAdmin,
    validate(deleteResult.validationScheme), 
    deleteResult,
  );

  parent.use(router.routes()).use(router.allowedMethods());
};
