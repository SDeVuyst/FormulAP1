import Router from '@koa/router';
import installCircuitRouter from './circuit';
import installRaceRouter from './race';
import installResultRouter from './result';
import installDriverRouter from './driver';
import installHealthRouter from './health';
import type { FormulaAppContext, FormulaAppState, KoaApplication } from '../types/koa';

export default (app: KoaApplication) => {
  const router = new Router<FormulaAppState, FormulaAppContext>({
    prefix: '/api',
  });

  installCircuitRouter(router);
  installRaceRouter(router);
  installResultRouter(router);
  installDriverRouter(router);
  installHealthRouter(router);

  app.use(router.routes()).use(router.allowedMethods());
};
