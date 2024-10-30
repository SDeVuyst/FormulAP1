// src/rest/session.ts
import Router from '@koa/router';
import Joi from 'joi';
import validate from '../core/validation';
import * as userService from '../service/driver';
import type {
  KoaContext,
  KoaRouter,
  FormulaAppState,
  FormulaAppContext,
} from '../types/koa';
import type { LoginResponse, LoginRequest } from '../types/driver';

const login = async (ctx: KoaContext<LoginResponse, void, LoginRequest>) => {
  const { email, password } = ctx.request.body;
  const token = await userService.login(email, password);

  ctx.status = 200;
  ctx.body = { token };
};

login.validationScheme = {
  body: {
    email: Joi.string().email(),
    password: Joi.string(),
  },
};

export default function installSessionRouter(parent: KoaRouter) {
  const router = new Router<FormulaAppState, FormulaAppContext>({
    prefix: '/sessions',
  });

  router.post('/', validate(login.validationScheme), login);

  parent.use(router.routes()).use(router.allowedMethods());
}
