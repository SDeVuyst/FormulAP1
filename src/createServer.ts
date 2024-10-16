import Koa from 'koa';
import { getLogger } from './core/logging';
import { initializeData, shutdownData } from './data';
import installRest from './rest';
import type { FormulaAppContext, FormulaAppState, KoaApplication } from './types/koa';
import bodyParser from 'koa-bodyparser';

export interface Server {
  getApp(): KoaApplication;
  start(): Promise<void>;
  stop(): Promise<void>;
}

export default async function createServer(): Promise<Server> {
  const app = new Koa<FormulaAppState, FormulaAppContext>();

  app.use(bodyParser());
  
  await initializeData();
  installRest(app);

  return {
    getApp() {
      return app;
    },

    start() {
      return new Promise<void>((resolve) => {
        app.listen(9000, () => {
          getLogger().info('🚀 Server listening on http://localhost:9000');
          resolve();
        });
      });
    },

    async stop() {
      app.removeAllListeners();
      await shutdownData();
      getLogger().info('Goodbye! 👋');
    },
  };
}

