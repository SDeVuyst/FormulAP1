import type Application from 'koa';

import Router from '@koa/router';
import installCircuitRouter from './circuit';
import installRaceRouter from './race';
import installResultRouter from './result';
import installDriverRouter from './driver';
import installHealthRouter from './health';

export default (app: Application) => {
  const router = new Router({
    prefix: '/api',
  });

  installCircuitRouter(router);
  installRaceRouter(router);
  installResultRouter(router);
  installDriverRouter(router);
  installHealthRouter(router);

  app.use(router.routes()).use(router.allowedMethods());
};
