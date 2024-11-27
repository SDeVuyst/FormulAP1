import Koa from 'koa';
import { getLogger } from './core/logging';
import { initializeData, shutdownData } from './data';
import installRest from './rest';
import type { FormulaAppContext, FormulaAppState, KoaApplication } from './types/koa';
import config from 'config';
import installMiddlewares from './core/installMiddlewares';

const PORT = config.get<number>('port');

export interface Server {
  getApp(): KoaApplication;
  start(): Promise<void>;
  stop(): Promise<void>;
}

export default async function createServer(): Promise<Server> {
  const app = new Koa<FormulaAppState, FormulaAppContext>();
  
  installMiddlewares(app);
  await initializeData();
  installRest(app);

  return {
    getApp() {
      return app;
    },

    start() {
      return new Promise<void>((resolve) => {
        app.listen(PORT);
        getLogger().info(`🚀 Server listening on http://localhost:${PORT}`);
        resolve();
      });
    },

    async stop() {
      app.removeAllListeners();
      await shutdownData();
      getLogger().info('Goodbye! 👋');
    },
  };
}

