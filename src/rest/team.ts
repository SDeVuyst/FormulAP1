import Router from '@koa/router';
import * as teamService from '../service/team';
import * as driverService from '../service/driver';
import * as carService from '../service/car';
import type { FormulaAppContext, FormulaAppState, KoaContext, KoaRouter } from '../types/koa';
import type { 
  CreateTeamRequest, 
  CreateTeamResponse, 
  GetAllTeamsResponse, 
  GetTeamByIdResponse,
  UpdateTeamRequest,
  UpdateTeamResponse,
} from '../types/team';
import type { IdParams } from '../types/common';
import type { GetAllDriversResponse } from '../types/driver';
import type { GetAllCarsResponse } from '../types/car';
import Joi from 'joi';
import validate from '../core/validation';
import { requireAuthentication, makeRequireRole } from '../core/auth';
import Role from '../core/roles';

/**
 * @api {get} /api/teams Get all teams
 * @apiName GetTeams
 * @apiGroup Team
 * 
 * @apiSuccess {Team[]} teams List of teams.
 * 
 * @apiError (400) BadRequest the request should not contain an argument.
 */
const getAllTeams = async (ctx: KoaContext<GetAllTeamsResponse>) => {
  const teams = await teamService.getAll();
  ctx.body = {
    items: teams,
  };
};
getAllTeams.validationScheme = null;

/**
 * @api {post} /api/teams Create new team
 * @apiName NewTeam
 * @apiGroup Team
 * 
 * @apiBody {String{..255}} name Team name.
 * @apiBody {String{..255}} country Team country.
 * @apiBody {Date} join_date Join date in the F1 Calendar.
 * 
 * @apiSuccess {Int} id Team ID.
 * @apiSuccess {String} name Team name.
 * @apiSuccess {String} country Team country.
 * @apiSuccess {Date} join_date Team join date.
 * 
 * @apiError (400) BadRequest Invalid route.
 * @apiError (400) BadRequest duplicate team name
 * @apiError (401) Unauthorized No authorization token provided
 * @apiError (401) Unauthorized Invalid authorization token provided
 * @apiError (403) Forbidden You must be logged in as Admin to add a Team.
 */
const createTeam = async (ctx: KoaContext<CreateTeamResponse, void, CreateTeamRequest>) => {
  const newTeam = await teamService.create(ctx.request.body);
  ctx.status = 201;
  ctx.body = newTeam;
};

createTeam.validationScheme = {
  body: {
    name: Joi.string().max(255),
    country: Joi.string().max(255),
    join_date: Joi.date().iso(),
  },
};

/**
 * @api {get} /api/teams/:id Get team by Id
 * @apiName GetTeamById
 * @apiGroup Team
 * 
 * @apiParam {Int} id Team ID.
 * 
 * @apiSuccess {Int} id Team ID.
 * @apiSuccess {String} name Team name.
 * @apiSuccess {String} country Team country.
 * @apiSuccess {Date} join_date Team join date.
 * 
 * @apiError (400) Bad Request Invalid team id
 * @apiError (404) NotFound No team with this id exists.
 */
const getTeamById = async (ctx: KoaContext<GetTeamByIdResponse, IdParams>) => {
  const team = await teamService.getById(ctx.params.id);
  ctx.body = team;
};

getTeamById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @api {put} /api/teams/:id Update team by Id
 * @apiName UpdateTeam
 * @apiGroup Team
 * 
 * @apiParam {Int} id Team's unique ID.
 * @apiBody {String{..255}} name Team name.
 * @apiBody {String{..255}} country Team country.
 * @apiBody {Date} join_date Join date in the F1 Calendar.
 * 
 * @apiSuccess {Int} id Team ID.
 * @apiSuccess {String} name Team name.
 * @apiSuccess {String} country Team country.
 * @apiSuccess {Date} join_date Team join date.
 * 
 * @apiError (404) NotFound No team with this id exists.
 * @apiError (400) BadRequest Invalid team id.
 * @apiError (400) BadRequest Duplicate team name.
 * @apiError (401) Unauthorized No authorization token provided
 * @apiError (401) Unauthorized Invalid authorization token provided
 * @apiError (403) Forbidden You must be logged in as Admin to update a Team.
 */
const updateTeam = async (
  ctx: KoaContext<UpdateTeamResponse, IdParams, UpdateTeamRequest>,
) => {
  ctx.body = await teamService.updateById(Number(ctx.params.id), ctx.request.body);
};

updateTeam.validationScheme = {
  params: { id: Joi.number().integer().positive() },
  body: {
    name: Joi.string().max(255),
    country: Joi.string().max(255),
    join_date: Joi.date().iso(),
  },
};

/**
 * @api {delete} /api/teams/:id Delete team
 * @apiName DeleteTeam
 * @apiGroup Team
 * 
 * @apiParam {Int} id Team's unique ID (URL parameter).
 * 
 * @apiSuccess (204) NoContent The team was successfully deleted and no content is returned.
 * 
 * @apiError (404) NotFound No team with this id exists.
 * @apiError (403) Forbidden You must be logged in as Admin to delete a Team.
 * @apiError (401) Unauthorized No authorization token provided
 * @apiError (401) Unauthorized Invalid authorization token provided
 */
const deleteTeam = async (ctx: KoaContext<void, IdParams>) => {
  await teamService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

deleteTeam.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @api {get} /api/teams/:id/drivers Get drivers by team Id
 * @apiName GetDriversByTeam
 * @apiGroup Team
 * 
 * @apiParam {Int} id Team unique ID (URL parameter).
 * 
 * @apiSuccess {Driver[]} drivers List of drivers.
 * 
 * @apiError (404) NotFound No team with this id exists.
 * @apiError (403) Forbidden You must be logged in as Admin to see Drivers.
 * @apiError (401) Unauthorized No authorization token provided
 * @apiError (401) Unauthorized Invalid authorization token provided
 */
const getDriversByTeamId = async(ctx: KoaContext<GetAllDriversResponse, IdParams>) => {

  await teamService.checkTeamExists(Number(ctx.params.id));

  const results = await driverService.getDriversByTeamId(Number(ctx.params.id));
  ctx.body = {
    items: results,
  };
};

getDriversByTeamId.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @api {get} /api/teams/:id/cars Get cars by team Id
 * @apiName GetCarsByTeam
 * @apiGroup Team
 * 
 * @apiParam {Int} id Team unique ID (URL parameter).
 * 
 * @apiSuccess {Car[]} cars List of cars.
 * 
 * @apiError (404) NotFound No team with this id exists.
 * @apiError (401) Unauthorized No authorization token provided
 * @apiError (401) Unauthorized Invalid authorization token provided
 */
const getCarsByTeamId = async(ctx: KoaContext<GetAllCarsResponse, IdParams>) => {

  await teamService.checkTeamExists(Number(ctx.params.id));

  const results = await carService.getCarsByTeamId(Number(ctx.params.id));
  ctx.body = {
    items: results,
  };
};

getCarsByTeamId.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<FormulaAppState, FormulaAppContext>({
    prefix: '/teams',
  });

  router.use(requireAuthentication);

  const requireAdmin = makeRequireRole(Role.ADMIN);

  router.get(
    '/',
    validate(getAllTeams.validationScheme), 
    getAllTeams,
  );

  router.post(
    '/', 
    requireAdmin,
    validate(createTeam.validationScheme), 
    createTeam,
  );

  router.get(
    '/:id', 
    validate(getTeamById.validationScheme), 
    getTeamById,
  );

  router.put(
    '/:id', 
    requireAdmin,
    validate(updateTeam.validationScheme),
    updateTeam,
  );

  router.delete(
    '/:id', 
    requireAdmin,
    validate(deleteTeam.validationScheme), 
    deleteTeam,
  );

  router.get(
    '/:id/drivers',
    requireAdmin,
    validate(getDriversByTeamId.validationScheme),
    getDriversByTeamId,
  );

  router.get(
    '/:id/cars',
    validate(getCarsByTeamId.validationScheme),
    getCarsByTeamId,
  );

  parent.use(router.routes()).use(router.allowedMethods());
};
