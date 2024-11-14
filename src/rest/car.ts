import Router from '@koa/router';
import * as carService from '../service/car';
import * as resultService from '../service/result';
import type { FormulaAppContext, FormulaAppState, KoaContext, KoaRouter } from '../types/koa';
import type { 
  CreateCarRequest, 
  CreateCarResponse, 
  GetAllCarsResponse, 
  GetCarByIdResponse,
  UpdateCarRequest,
  UpdateCarResponse,
} from '../types/car';
import type { GetAllResultsResponse } from '../types/result';
import type { IdParams } from '../types/common';
import Joi from 'joi';
import validate from '../core/validation';
import { requireAuthentication, makeRequireRole } from '../core/auth';
import Role from '../core/roles';

/**
 * @api {get} /api/cars Get all cars
 * @apiName GetCars
 * @apiGroup Car
 * 
 * @apiSuccess {Car[]} cars List of cars.
 * 
 * @apiError (400) BadRequest the request should not contain an argument.
 */
const getAllCars = async (ctx: KoaContext<GetAllCarsResponse>) => {
  const cars = await carService.getAll();
  ctx.body = {
    items: cars,
  };
};
getAllCars.validationScheme = null;

/**
 * @api {post} /api/cars Create new car
 * @apiName NewCar
 * @apiGroup Car
 * 
 * @apiParam {Int} id Car's unique ID.
 * @apiBody {String{..255}} model Car model.
 * @apiBody {Float} weight Car weight.
 * @apiBody {Int} year Car year.
 * @apiBody {Int} team_id Id of team that this car belongs to.
 * 
 * @apiSuccess {String} model Car model.
 * @apiSuccess {Float} weight Car weight.
 * @apiSuccess {Int} year Car year.
 * @apiSuccess {Car.id} id Id of team that this car belongs to.
 * 
 * @apiError (400) BadRequest Invalid route.
 * @apiError (400) BadRequest duplicate car name
 * @apiError (401) Unauthorized No authorization token provided
 * @apiError (401) Unauthorized Invalid authorization token provided
 * @apiError (403) Forbidden You must be logged in as Admin to add a Car.
 */
const createCar = async (ctx: KoaContext<CreateCarResponse, void, CreateCarRequest>) => {
  const newCar = await carService.create(ctx.request.body);
  ctx.status = 201;
  ctx.body = newCar;
};

createCar.validationScheme = {
  body: {
    model: Joi.string().max(255),
    weight: Joi.number().positive().precision(2),
    year: Joi.number().integer().min(1949),
    team_id: Joi.number().integer().positive(),
  },
};

/**
 * @api {get} /api/cars/:id Get car by Id
 * @apiName GetCarById
 * @apiGroup Car
 * 
 * @apiParam {Int} id Car ID.
 * 
 * @apiSuccess {String} model Car model.
 * @apiSuccess {Float} weight Car weight.
 * @apiSuccess {Int} year Car year.
 * @apiSuccess {Car.id} id Id of team that this car belongs to.
 * 
 * @apiError (400) Bad Request Invalid car id
 * @apiError (404) NotFound No car with this id exists.
 */
const getCarById = async (ctx: KoaContext<GetCarByIdResponse, IdParams>) => {
  const car = await carService.getById(ctx.params.id);
  ctx.body = car;
};

getCarById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @api {put} /api/cars/:id Update car by Id
 * @apiName UpdateCar
 * @apiGroup Car
 * 
 * @apiParam {Int} id Car's unique ID.
 * @apiBody {String{..255}} model Car model.
 * @apiBody {Float} weight Car weight.
 * @apiBody {Int} year Car year.
 * @apiBody {Int} team_id Id of team that this car belongs to.
 * 
 * @apiSuccess {String} model Car model.
 * @apiSuccess {Float} weight Car weight.
 * @apiSuccess {Int} year Car year.
 * @apiSuccess {Car.id} id Id of team that this car belongs to.
 * 
 * @apiError (404) NotFound No car with this id exists.
 * @apiError (400) BadRequest Invalid car id.
 * @apiError (400) BadRequest Duplicate car name.
 * @apiError (401) Unauthorized No authorization token provided
 * @apiError (401) Unauthorized Invalid authorization token provided
 * @apiError (403) Forbidden You must be logged in as Admin to update a Car.
 */
const updateCar = async (
  ctx: KoaContext<UpdateCarResponse, IdParams, UpdateCarRequest>,
) => {
  ctx.body = await carService.updateById(Number(ctx.params.id), ctx.request.body);
};

updateCar.validationScheme = {
  params: { id: Joi.number().integer().positive() },
  body: {
    model: Joi.string().max(255),
    weight: Joi.number().positive().precision(2),
    year: Joi.number().integer().min(1949),
    team_id: Joi.number().integer().positive(),
  },
};

/**
 * @api {delete} /api/cars/:id Delete car
 * @apiName DeleteCar
 * @apiGroup Car
 * 
 * @apiParam {Int} id Car's unique ID (URL parameter).
 * 
 * @apiSuccess (204) NoContent The car was successfully deleted and no content is returned.
 * 
 * @apiError (404) NotFound No car with this id exists.
 * @apiError (403) Forbidden You must be logged in as Admin to delete a Car.
 * @apiError (401) Unauthorized No authorization token provided
 * @apiError (401) Unauthorized Invalid authorization token provided
 */
const deleteCar = async (ctx: KoaContext<void, IdParams>) => {
  await carService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

deleteCar.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @api {get} /api/cars/:id/results Get results by car Id
 * @apiName GetResultsByCar
 * @apiGroup Car
 * 
 * @apiParam {Int} id Car unique ID (URL parameter).
 * 
 * @apiSuccess {Results[]} results List of results.
 * 
 * @apiError (404) NotFound No car with this id exists.
 * @apiError (401) Unauthorized No authorization token provided
 * @apiError (401) Unauthorized Invalid authorization token provided
 */
const getResultsByCarId = async(ctx: KoaContext<GetAllResultsResponse, IdParams>) => {

  await carService.checkCarExists(Number(ctx.params.id));

  const results = await resultService.getResultsByCarId(Number(ctx.params.id));
  ctx.body = {
    items: results,
  };
};

getResultsByCarId.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<FormulaAppState, FormulaAppContext>({
    prefix: '/cars',
  });

  router.use(requireAuthentication);

  const requireAdmin = makeRequireRole(Role.ADMIN);

  router.get(
    '/',
    validate(getAllCars.validationScheme), 
    getAllCars,
  );

  router.post(
    '/', 
    requireAdmin,
    validate(createCar.validationScheme), 
    createCar,
  );

  router.get(
    '/:id', 
    validate(getCarById.validationScheme), 
    getCarById,
  );

  router.put(
    '/:id', 
    requireAdmin,
    validate(updateCar.validationScheme),
    updateCar,
  );

  router.delete(
    '/:id', 
    requireAdmin,
    validate(deleteCar.validationScheme), 
    deleteCar,
  );

  router.get(
    '/:id/results',
    validate(getResultsByCarId.validationScheme),
    getResultsByCarId,
  );

  parent.use(router.routes()).use(router.allowedMethods());
};
