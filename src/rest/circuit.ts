import Router from '@koa/router';
import * as circuitService from '../service/circuit';
import * as raceService from '../service/race';
import type { FormulaAppContext, FormulaAppState, KoaContext, KoaRouter } from '../types/koa';
import type { 
  CreateCircuitRequest, 
  CreateCircuitResponse, 
  GetAllCircuitsResponse, 
  GetCircuitByIdResponse,
  UpdateCircuitRequest,
  UpdateCircuitResponse,
} from '../types/circuit';
import type {
  GetAllRacesResponse,
} from '../types/race';
import type { IdParams } from '../types/common';
import Joi from 'joi';
import validate from '../core/validation';
import { requireAuthentication, makeRequireRole } from '../core/auth';
import Role from '../core/roles';

/**
 * @api {get} /api/circuits Get all circuits
 * @apiName GetCircuits
 * @apiGroup Circuit
 * 
 * @apiSuccess {Circuit[]} circuits List of circuits.
 * 
 * @apiError (400) BadRequest the request should not contain an argument.
 */
const getAllCircuits = async (ctx: KoaContext<GetAllCircuitsResponse>) => {
  const circuits = await circuitService.getAll();
  ctx.body = {
    items: circuits,
  };
};
getAllCircuits.validationScheme = null;

/**
 * @api {post} /api/circuits Create new circuit
 * @apiName NewCircuit
 * @apiGroup Circuit
 * 
 * @apiBody {String{..255}} name Unique circuit name.
 * @apiBody {String{..255}} city Circuit city.
 * @apiBody {String{..255}} country Circuit country.
 * @apiBody {Boolean} active If circuit is active in the F1 Calendar.
 * 
 * @apiSuccess {Int} id Circuit ID.
 * @apiSuccess {String} name Circuit name.
 * @apiSuccess {String} city Circuit city.
 * @apiSuccess {String} country Circuit country.
 * @apiSuccess {Boolean} active If circuit is active in the F1 Calendar.\
 * 
 * @apiError (400) BadRequest Invalid route.
 * @apiError (400) BadRequest duplicate circuit name
 * @apiError (401) Unauthorized No authorization token provided
 * @apiError (401) Unauthorized Invalid authorization token provided
 * @apiError (403) Forbidden You must be logged in as Admin to add a Circuit.
 */
const createCircuit = async (ctx: KoaContext<CreateCircuitResponse, void, CreateCircuitRequest>) => {
  const newCircuit = await circuitService.create(ctx.request.body);
  ctx.status = 201;
  ctx.body = newCircuit;
};

createCircuit.validationScheme = {
  body: {
    name: Joi.string().max(255),
    city: Joi.string().max(255),
    country: Joi.string().max(255),
    active: Joi.boolean(),
  },
};

/**
 * @api {get} /api/circuits/:id Get circuit by Id
 * @apiName GetCircuitById
 * @apiGroup Circuit
 * 
 * @apiParam {Int} id Circuit ID.
 * 
 * @apiSuccess {Int} id Circuit ID.
 * @apiSuccess {String{..255}} name Circuit name.
 * @apiSuccess {String{..255}} city Circuit city.
 * @apiSuccess {String{..255}} country Circuit country.
 * @apiSuccess {Boolean} active If circuit is active in the F1 Calendar.
 * 
 * @apiError (400) Bad Request Invalid circuit id
 * @apiError (404) NotFound No circuit with this id exists.
 */
const getCircuitById = async (ctx: KoaContext<GetCircuitByIdResponse, IdParams>) => {
  const circuit = await circuitService.getById(ctx.params.id);
  ctx.body = circuit;
};

getCircuitById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @api {put} /api/circuits/:id Update circuit by Id
 * @apiName UpdateCircuit
 * @apiGroup Circuit
 * 
 * @apiParam {Int} id Circuit's unique ID.
 * @apiBody {String{..255}} name Circuit name.
 * @apiBody {String{..255}} city Circuit city.
 * @apiBody {String{..255}} country Circuit country.
 * @apiBody {Boolean{..255}} active If the circuit is active in the F1 Calendar.
 * 
 * @apiSuccess {Int} id Circuit ID.
 * @apiSuccess {String} name Circuit name.
 * @apiSuccess {String} city Circuit city.
 * @apiSuccess {String} country Circuit country.
 * @apiSuccess {Boolean} active If the circuit is active in the F1 Calendar. 
 * 
 * @apiError (404) NotFound No circuit with this id exists.
 * @apiError (400) BadRequest Invalid circuit id.
 * @apiError (400) BadRequest Duplicate circuit name.
 * @apiError (401) Unauthorized No authorization token provided
 * @apiError (401) Unauthorized Invalid authorization token provided
 * @apiError (403) Forbidden You must be logged in as Admin to update a Circuit.
 */
const updateCircuit = async (
  ctx: KoaContext<UpdateCircuitResponse, IdParams, UpdateCircuitRequest>,
) => {
  ctx.body = await circuitService.updateById(Number(ctx.params.id), ctx.request.body);
};

updateCircuit.validationScheme = {
  params: { id: Joi.number().integer().positive() },
  body: {
    name: Joi.string().max(255),
    city: Joi.string().max(255),
    country: Joi.string().max(255),
    active: Joi.boolean(),
  },
};

/**
 * @api {delete} /api/circuits/:id Delete circuit
 * @apiName DeleteCircuit
 * @apiGroup Circuit
 * 
 * @apiParam {Int} id Circuit's unique ID (URL parameter).
 * 
 * @apiSuccess (204) NoContent The circuit was successfully deleted and no content is returned.
 * 
 * @apiError (404) NotFound No circuit with this id exists.
 * @apiError (403) Forbidden You must be logged in as Admin to delete a Circuit.
 * @apiError (401) Unauthorized No authorization token provided
 * @apiError (401) Unauthorized Invalid authorization token provided
 */
const deleteCircuit = async (ctx: KoaContext<void, IdParams>) => {
  await circuitService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

deleteCircuit.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @api {get} /api/circuits/:id/races Get races by circuit Id
 * @apiName GetRacesByCircuit
 * @apiGroup Circuit
 * 
 * @apiParam {Int} id Circuit's unique ID (URL parameter).
 * 
 * @apiSuccess {Races[]} races List of races.
 * 
 * @apiError (400) BadRequest Invalid circuit id
 * @apiError (404) NotFound No circuit with this id exists.
 */
const getRacesByCircuitId = async(ctx: KoaContext<GetAllRacesResponse, IdParams>) => {
  const races = await raceService.getRacesByCircuitId(
    Number(ctx.params.id),
  );
  ctx.body = {
    items: races,
  };
};

getRacesByCircuitId.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<FormulaAppState, FormulaAppContext>({
    prefix: '/circuits',
  });

  const requireAdmin = makeRequireRole(Role.ADMIN);

  router.get(
    '/',
    validate(getAllCircuits.validationScheme), 
    getAllCircuits,
  );

  router.post(
    '/', 
    requireAuthentication,
    requireAdmin,
    validate(createCircuit.validationScheme), 
    createCircuit,
  );

  router.get(
    '/:id', 
    validate(getCircuitById.validationScheme), 
    getCircuitById,
  );

  router.put(
    '/:id', 
    requireAuthentication,
    requireAdmin,
    validate(updateCircuit.validationScheme),
    updateCircuit,
  );

  router.delete(
    '/:id', 
    requireAuthentication,
    requireAdmin,
    validate(deleteCircuit.validationScheme), 
    deleteCircuit,
  );

  router.get(
    '/:id/races', 
    validate(getRacesByCircuitId.validationScheme), 
    getRacesByCircuitId,
  );

  parent.use(router.routes()).use(router.allowedMethods());
};
