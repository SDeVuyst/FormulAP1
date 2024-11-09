import Router from '@koa/router';
import type { Next } from 'koa';
import * as driverService from '../service/driver';
import * as resultService from '../service/result';
import type { FormulaAppContext, FormulaAppState, KoaContext, KoaRouter } from '../types/koa';
import type { 
  RegisterDriverRequest,
  GetAllDriversResponse, 
  GetDriverByIdResponse,
  UpdateDriverRequest,
  UpdateDriverResponse,
  GetDriverRequest,
  LoginResponse,
} from '../types/driver';
import type { IdParams } from '../types/common';
import type { GetAllResultsResponse } from '../types/result';
import { requireAuthentication, makeRequireRole, authDelay } from '../core/auth';
import Role from '../core/roles';
import validate from '../core/validation';
import Joi from 'joi';
import { passwordSchema } from '../core/password';

const checkDriverId = (ctx: KoaContext<unknown, GetDriverRequest>, next: Next) => {
  const { userId, roles } = ctx.state.session;
  const { id } = ctx.params;

  // You can only get our own data unless you're an admin
  if (id !== 'me' && id !== userId && !roles.includes(Role.ADMIN)) {
    return ctx.throw(
      403,
      'You are not allowed to view this driver\'s information',
      { code: 'FORBIDDEN' },
    );
  }
  return next();
};

/**
 * @api {get} /api/drivers Get all drivers
 * @apiName GetDrivers
 * @apiGroup Driver
 * 
 * @apiSuccess {Driver[]} drivers List of drivers.
 * @apiError (400) Bad Request Invalid argument
 * @apiError (401) Unauthorized No authorization token provided
 * @apiError (401) Unauthorized Invalid authorization token provided
 * @apiError (403) Forbidden You must be logged in as Admin to see drivers.
 */
const getAllDrivers = async (ctx: KoaContext<GetAllDriversResponse>) => {

  const { roles } = ctx.state.session;

  if (!roles.includes(Role.ADMIN)) {
    return ctx.throw(
      403,
      'You must be logged in as admin to see drivers',
      { code: 'FORBIDDEN' },
    );
  };

  const drivers = await driverService.getAll();
  ctx.body = {
    items: drivers,
  };
};

getAllDrivers.validationScheme = null;

/**
 * @api {post} /api/drivers/ Register new driver
 * @apiName RegisterDriver
 * @apiGroup Driver
 * 
 * @apiBody {String{..255}} first_name Drivers first name.
 * @apiBody {String{..255}} last_name Drivers last name.
 * @apiBody {Boolean} active If driver is active in the current grid.
 * @apiBody {String{email}} email Drivers email.
 * @apiBody {String} password Drivers password
 * 
 * @apiSuccess {Int} id Driver ID.
 * @apiSuccess {String{..255}} first_name Drivers first name.
 * @apiSuccess {String{..255}} last_name Drivers last name.
 * @apiSuccess {Boolean} active If driver is active in the current grid.
 * 
 * @apiError (400) BadRequest Invalid request.
 * @apiError (401) Unauthorized No authorization token provided
 * @apiError (401) Unauthorized Invalid authorization token provided
 */
const registerDriver = async (ctx: KoaContext<LoginResponse, void, RegisterDriverRequest>) => {
  const token = await driverService.register(ctx.request.body);
  ctx.status = 200;
  ctx.body = { token };
};

registerDriver.validationScheme = {
  body: {
    first_name: Joi.string().max(255),
    last_name: Joi.string().max(255),
    status: Joi.string().max(255).optional(),
    email: Joi.string().email(),
    password: passwordSchema,
  },
};

/**
 * @api {get} /api/drivers/:id Get driver by Id
 * @apiName GetDriverById
 * @apiGroup Driver
 * 
 * @apiParam {Int} id Driver ID.
 * 
 * @apiSuccess {Int} id Driver ID.
 * @apiSuccess {String{..255}} first_name Drivers first name.
 * @apiSuccess {String{..255}} last_name Drivers last name.
 * @apiSuccess {Boolean} active If driver is active in the current grid.
 * 
 * @apiError (404) NotFound No driver with this id exists.
 * @apiError (400) BadRequest Invalid request.
 * @apiError (403) Forbidden You must be logged in as current driver or Admin to get a driver.
 * @apiError (401) Unauthorized No authorization token provided
 * @apiError (401) Unauthorized Invalid authorization token provided
 */
const getDriverById = async (ctx: KoaContext<GetDriverByIdResponse, GetDriverRequest>) => {  
  const driver = await driverService.getById(
    ctx.params.id === 'me' ? ctx.state.session.userId : ctx.params.id,
  );
  ctx.status = 200;
  ctx.body = driver;
};

getDriverById.validationScheme = {
  params: {
    id: [Joi.number().integer().positive(), 'me'],
  },
};

/**
 * @api {put} /api/drivers/:id Update driver by Id
 * @apiName UpdateDriverById
 * @apiGroup Driver
 * 
 * @apiParam {Int} id Driver ID.
 * 
 * @apiBody {String{..255}} first_name Drivers first name.
 * @apiBody {String{..255}} last_name Drivers last name.
 * @apiBody {Boolean} active If driver is active in the current grid.
 * 
 * @apiSuccess {Int} id Driver ID.
 * @apiSuccess {String{..255}} first_name Drivers first name.
 * @apiSuccess {String{..255}} last_name Drivers last name.
 * @apiSuccess {Boolean} active If driver is active in the current grid.
 * 
 * @apiError (404) NotFound No driver with this id exists.
 * @apiError (400) BadRequest Invalid request.
 * @apiError (403) Forbidden You must be logged in as current driver or Admin to update a driver.
 * @apiError (401) Unauthorized No authorization token provided
 * @apiError (401) Unauthorized Invalid authorization token provided
 */
const updateDriverById = async (
  ctx: KoaContext<UpdateDriverResponse, IdParams, UpdateDriverRequest>,
) => {
  
  ctx.status = 200;
  ctx.body = await driverService.updateById(Number(ctx.params.id), ctx.request.body);
  
};

updateDriverById.validationScheme = {
  params: { id: Joi.number().integer().positive() },
  body: {
    first_name: Joi.string().max(255),
    last_name: Joi.string().max(255),
    status: Joi.string().max(255).optional(),
  },
};

/**
 * @api {delete} /api/drivers/:id Delete driver
 * @apiName DeleteDriver
 * @apiGroup Driver
 * 
 * @apiParam {Int} id Driver's unique ID (URL parameter).
 * 
 * @apiSuccess (204) NoContent The driver was successfully deleted and no content is returned.
 * 
 * @apiError (404) NotFound No driver with this id exists.
 * @apiError (403) Forbidden You must be logged in as current driver or Admin to delete a driver.
 * @apiError (401) Unauthorized No authorization token provided
 * @apiError (401) Unauthorized Invalid authorization token provided
 */
const deleteDriverById = async (ctx: KoaContext<void, IdParams>) => {
  await driverService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

deleteDriverById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @api {get} /api/drivers/:id/results Get results by driver Id
 * @apiName GetResultsByDriver
 * @apiGroup Driver
 * 
 * @apiParam {Int} id Drivers unique ID (URL parameter).
 * 
 * @apiSuccess {Result[]} results List of results.
 * 
 * @apiError (404) NotFound No driver with this id exists.
 * @apiError (403) Forbidden You must be logged in as current driver or Admin to get results of a driver.
 * @apiError (400) Bad Request Invalid User Id
 * @apiError (401) Unauthorized No authorization token provided
 * @apiError (401) Unauthorized Invalid authorization token provided
 */
const getResultsByDriverId = async(ctx: KoaContext<GetAllResultsResponse, IdParams>) => {

  await driverService.checkDriverExists(Number(ctx.params.id));
  
  const results = await resultService.getResultsByDriverId(Number(ctx.params.id));

  ctx.status = 200;
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

  router.use(requireAuthentication);
  const requireAdmin = makeRequireRole(Role.ADMIN);

  router.get(
    '/', 
    requireAdmin,
    validate(getAllDrivers.validationScheme), 
    getAllDrivers,
  );

  router.get(
    '/:id', 
    validate(getDriverById.validationScheme), 
    checkDriverId,
    getDriverById,
  );

  router.post(
    '/',
    authDelay,
    validate(registerDriver.validationScheme),
    registerDriver,
  );

  router.put(
    '/:id', 
    validate(updateDriverById.validationScheme), 
    checkDriverId,
    updateDriverById,
  );

  router.delete(
    '/:id',
    validate(deleteDriverById.validationScheme), 
    checkDriverId,
    deleteDriverById,
  );

  router.get(
    '/:id/results', 
    validate(getResultsByDriverId.validationScheme), 
    checkDriverId,
    getResultsByDriverId,
  );

  parent
    .use(router.routes())
    .use(router.allowedMethods());
};
