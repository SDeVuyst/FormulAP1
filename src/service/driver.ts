// src/service/driver.ts
import jwt from 'jsonwebtoken';
import { generateJWT, verifyJWT } from '../core/jwt';
import { getLogger } from '../core/logging';
import { hashPassword, verifyPassword } from '../core/password';
import ServiceError from '../core/serviceError';
import { prisma } from '../data';
import Role from '../core/roles';
import type { Driver, DriverCreateInput, DriverUpdateInput, PublicDriver } from '../types/driver';
import type { SessionInfo } from '../types/auth';
import handleDBError from './_handleDBError';

const makeExposedDriver = ({ id, first_name, last_name, status, email }: Driver): PublicDriver => ({
  id,
  first_name,
  last_name,
  status,
  email,
});

export const checkAndParseSession = async (
  authHeader?: string,
): Promise<SessionInfo> => {
  if (!authHeader) {
    throw ServiceError.unauthorized('You need to be signed in');
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw ServiceError.unauthorized('Invalid authentication token');
  }

  const authToken = authHeader.substring(7);

  try {
    const { roles, sub } = await verifyJWT(authToken);

    return {
      userId: Number(sub),
      roles,
    };
  } catch (error: any) {
    getLogger().error(error.message, { error });

    if (error instanceof jwt.TokenExpiredError) {
      throw ServiceError.unauthorized('The token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw ServiceError.unauthorized(
        `Invalid authentication token: ${error.message}`,
      );
    } else {
      throw ServiceError.unauthorized(error.message);
    }
  }
};

export const checkRole = (role: string, roles: string[]): void => {
  const hasPermission = roles.includes(role);

  if (!hasPermission) {
    throw ServiceError.forbidden(
      'You are not allowed to view this part of the application',
    );
  }
};

export const login = async (
  email: string,
  password: string,
): Promise<string> => {
  const driver = await prisma.driver.findUnique({ where: { email } });

  if (!driver) {
    // DO NOT expose we don't know the user
    throw ServiceError.unauthorized(
      'The given email and password do not match',
    );
  }

  const passwordValid = await verifyPassword(password, driver.password_hash);

  if (!passwordValid) {
    // DO NOT expose we know the user but an invalid password was given
    throw ServiceError.unauthorized(
      'The given email and password do not match',
    );
  }

  return await generateJWT(driver);
};

export const getAll = async (): Promise<PublicDriver[]> => {
  const drivers =  await prisma.driver.findMany();
  return drivers.map(makeExposedDriver);
};

export const getById = async (id: number): Promise<PublicDriver> => {
  const driver = await prisma.driver.findUnique({
    where: {
      id,
    },
  });

  if (!driver) {
    throw ServiceError.notFound('No driver with this id exists');
  }

  return makeExposedDriver(driver);
};

export const register = async ({
  first_name,
  last_name,
  status,
  email,
  password,
}: DriverCreateInput): Promise<string> => {
  try {
    const passwordHash = await hashPassword(password);
    const driver = await prisma.driver.create({
      data: {
        first_name,
        last_name,
        status,
        email,
        password_hash: passwordHash,
        roles: [Role.USER],
      },
    });

    return await generateJWT(driver);
  } catch (error) {
    throw handleDBError(error);
  }
};

export const updateById = async ( 
  id: number, 
  changes: DriverUpdateInput,
): Promise<PublicDriver> => {
  try {
    const driver = await prisma.driver.update({
      where: {
        id,
      },
      data: changes,
    });
    return makeExposedDriver(driver);
  } catch (error) {
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number): Promise<void> => {
  try {
    await prisma.driver.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const checkDriverExists = async (id: number) => {
  const count = await prisma.driver.count({
    where: {
      id,
    },
  });

  if (count === 0) {
    throw ServiceError.notFound('No driver with this id exists');
  }
};
