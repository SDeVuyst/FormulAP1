// src/rest/health.ts
import Router from '@koa/router';
import * as healthService from '../service/health';
import type { FormulaAppContext, FormulaAppState, KoaContext, KoaRouter } from '../types/koa';
import type { PingResponse, VersionResponse } from '../types/health';
import validate from '../core/validation';

/**
 * @api {get} /api/health/ping Ping the API
 * @apiName Ping
 * @apiGroup Health
 * 
 * @apiSuccess {Boolean} pong API is responsive.
 */
const ping = async (ctx: KoaContext<PingResponse>) => {
  ctx.status = 200;
  ctx.body = healthService.ping();
};
ping.validationScheme = null;

/**
 * @api {get} /api/health/version Get API Version
 * @apiName GetVersion
 * @apiGroup Health
 * 
 * @apiSuccess {String} env Current environment (e.g., "development", "production").
 * @apiSuccess {String} version The version of the API/application.
 * @apiSuccess {String} name The name of the application.
 */
const getVersion = async (ctx: KoaContext<VersionResponse>) => {
  ctx.status = 200;
  ctx.body = healthService.getVersion();
};
getVersion.validationScheme = null;

export default (parent: KoaRouter) => {
  const router = new Router<FormulaAppState, FormulaAppContext>({ prefix: '/health' });

  router.get('/ping', validate(ping.validationScheme), ping);
  router.get('/version', validate(getVersion.validationScheme), getVersion);

  parent.use(router.routes()).use(router.allowedMethods());
};
