import Router from '@koa/router';
import * as raceService from '../service/race';
import * as resultService from '../service/result';
import type { FormulaAppContext, FormulaAppState, KoaContext, KoaRouter } from '../types/koa';
import type { 
  CreateRaceRequest, 
  CreateRaceResponse, 
  GetAllRacesResponse, 
  GetRaceByIdResponse, 
  UpdateRaceRequest, 
  UpdateRaceResponse,
} from '../types/race';
import type { IdParams } from '../types/common';
import type { GetAllResultsResponse } from '../types/result';
import validate from '../core/validation';
import Joi from 'joi';
import { requireAuthentication, makeRequireRole } from '../core/auth';
import Role from '../core/roles';

/**
 * @api {get} /api/races Get all races
 * @apiName GetRaces
 * @apiGroup Race
 * 
 * @apiSuccess {Races[]} races List of races.
 */
const getAllRaces = async (ctx: KoaContext<GetAllRacesResponse>) => {
  const races = await raceService.getAll();
  ctx.body = {
    items: races,
  };
};
getAllRaces.validationScheme = null;

/**
 * @api {post} /api/races Create new race
 * @apiName NewRace
 * @apiGroup Race
 * 
 * @apiBody {Date} date Date of the race.
 * @apiBody {Int} laps Amount of laps.
 * @apiBody {Int} circuit_id Circuit's unique ID.
 * 
 * @apiSuccess {Int} id Race ID.
 * @apiSuccess {Date} date Date of the race.
 * @apiSuccess {Int} laps Amount of laps.
 * @apiSuccess {Circuit} circuit Limited circuit object.
 * @apiSuccess {Int} circuit.id Circuit's unique ID.
 * @apiSuccess {String} circuit.name Name of the circuit.
 * 
 * @apiError (404) NotFound No race with this id exists.
 * @apiError (400) BadRequest Invalid request.
 * @apiError (401) Unauthorized You must be logged in as Admin to add a Race.
 */
const createRace = async (ctx: KoaContext<CreateRaceResponse, void, CreateRaceRequest>) => {
  const newRace = await raceService.create(ctx.request.body);
  ctx.status = 201;
  ctx.body = newRace;
};

createRace.validationScheme = {
  body: {
    date: Joi.date().iso(),
    laps: Joi.number().integer().positive(),
    circuit_id: Joi.number().integer().positive(),
  },
};

/**
 * @api {get} /api/races/:id Get race by Id
 * @apiName GetRaceById
 * @apiGroup Race
 * 
 * @apiParam {Int} id Race ID.
 * 
 * @apiSuccess {Int} id Race ID.
 * @apiSuccess {Date} date Date of the race.
 * @apiSuccess {Int} laps Amount of laps.
 * @apiSuccess {Circuit} circuit Limited circuit object.
 * @apiSuccess {Int} circuit.id Circuit's unique ID.
 * @apiSuccess {String} circuit.name Name of the circuit.
 * 
 * @apiError (404) NotFound No race with this id exists.
 * @apiError (400) BadRequest Invalid race id.
 */
const getRaceById = async (ctx: KoaContext<GetRaceByIdResponse, IdParams>) => {
  const race = await raceService.getById(Number(ctx.params.id));
  ctx.body = race;
};

getRaceById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @api {put} /api/races/:id Update race by Id
 * @apiName UpdateRaceById
 * @apiGroup Race
 * 
 * @apiParam {Int} id Race ID.
 * 
 * @apiBody {Date} date Date of the race.
 * @apiBody {Int} laps Amount of laps.
 * @apiBody {Int} circuit_id Circuit's unique ID.
 * 
 * @apiSuccess {Int} id Race ID.
 * @apiSuccess {Date} date Date of the race.
 * @apiSuccess {Int} laps Amount of laps.
 * @apiSuccess {Circuit} circuit Limited circuit object.
 * @apiSuccess {Int} circuit.id Circuit's unique ID.
 * @apiSuccess {String} circuit.name Name of the circuit.
 * 
 * @apiError (404) NotFound No race with this id exists.
 * @apiError (400) BadRequest Invalid request.
 * @apiError (401) Unauthorized You must be logged in as Admin to update a Race.
 */
const updateRace = async (
  ctx: KoaContext<UpdateRaceResponse, IdParams, UpdateRaceRequest>,
) => {
  ctx.body = await raceService.updateById(Number(ctx.params.id), ctx.request.body);
};

updateRace.validationScheme = {
  params: { id: Joi.number().integer().positive() },
  body: {
    date: Joi.date().iso(),
    laps: Joi.number().integer().positive(),
    circuit_id: Joi.number().integer().positive(),
  },
};

/**
 * @api {delete} /api/races/:id Delete race
 * @apiName DeleteRace
 * @apiGroup Race
 * 
 * @apiParam {Int} id Race's unique ID (URL parameter).
 * 
 * @apiSuccess (204) NoContent The race was successfully deleted and no content is returned.
 * 
 * @apiError (404) NotFound No race with this id exists.
 * @apiError (401) Unauthorized You must be logged in as Admin to delete a Race.
 */
const deleteRace = async (ctx: KoaContext<void, IdParams>) => {
  await raceService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

deleteRace.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @api {get} /api/races/:id/results Get results by race Id
 * @apiDescription This route gets the result of the currently authorized driver. 
 * If logged in as admin, it gets all the results # TODO
 * @apiName GetResultsByRace
 * @apiGroup Race
 * 
 * @apiParam {Int} id Race unique ID (URL parameter).
 * 
 * @apiSuccess {Result[]} results List of results.
 * 
 * @apiError (404) NotFound No race with this id exists.
 * @apiError (401) Unauthorized You must be logged in as Admin to see Results.
 */
const getResultsByRaceId = async(ctx: KoaContext<GetAllResultsResponse, IdParams>) => {

  await raceService.checkRaceExists(Number(ctx.params.id));

  const results = await resultService.getResultsByRaceId(Number(ctx.params.id));
  ctx.body = {
    items: results,
  };
};

getResultsByRaceId.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<FormulaAppState, FormulaAppContext>({
    prefix: '/races',
  });

  const requireAdmin = makeRequireRole(Role.ADMIN);

  router.get(
    '/', 
    validate(getAllRaces.validationScheme), 
    getAllRaces,
  );

  router.get(
    '/:id', 
    validate(getRaceById.validationScheme), 
    getRaceById,
  );

  router.post(
    '/', 
    requireAuthentication,
    requireAdmin,
    validate(createRace.validationScheme), 
    createRace,
  );

  router.put(
    '/:id', 
    requireAuthentication,
    requireAdmin,
    validate(updateRace.validationScheme), 
    updateRace,
  );

  router.delete(
    '/:id', 
    requireAuthentication,
    requireAdmin,
    validate(deleteRace.validationScheme), 
    deleteRace,
  );

  router.get(
    '/:id/results', 
    requireAuthentication,
    validate(getResultsByRaceId.validationScheme), 
    getResultsByRaceId,
  );

  parent.use(router.routes()).use(router.allowedMethods());
};
