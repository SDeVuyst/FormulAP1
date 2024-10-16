import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { getLogger } from './core/logging';
import { initializeData } from './data';
import installRest from './rest';
import type { FormulaAppContext, FormulaAppState } from './types/koa';

async function main(): Promise<void> {

  const app = new Koa<FormulaAppState, FormulaAppContext>();

  app.use(bodyParser());

  await initializeData();

  installRest(app);

  app.listen(9000, () => {
    getLogger().info('🚀 Server listening on http://127.0.0.1:9000');
  });

}

main();
