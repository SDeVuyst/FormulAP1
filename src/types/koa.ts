// src/types/koa.ts
import type { ParameterizedContext } from 'koa';
import type { SessionInfo } from './auth';
import type Application from 'koa';
import type Router from '@koa/router';

export interface FormulaAppState {
  session: SessionInfo;
}

export interface FormulaAppContext<
  Params = unknown,
  RequestBody = unknown,
  Query = unknown,
> {
  request: {
    body: RequestBody;
    query: Query;
  };
  params: Params;
}

export type KoaContext<
  ResponseBody = unknown,
  Params = unknown,
  RequestBody = unknown,
  Query = unknown,
> = ParameterizedContext<
  FormulaAppState,
  FormulaAppContext<Params, RequestBody, Query>,
  ResponseBody
>;

export interface KoaApplication
  extends Application<FormulaAppState, FormulaAppContext> {}

export interface KoaRouter extends Router<FormulaAppState, FormulaAppContext> {}
