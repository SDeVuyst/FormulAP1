// src/core/password.ts
import config from 'config';
import argon2 from 'argon2';
import Joi from 'joi';
import zxcvbn from 'zxcvbn';

const ARGON_HASH_LENGTH = config.get<number>('auth.argon.hashLength');
const ARGON_TIME_COST = config.get<number>('auth.argon.timeCost');
const ARGON_MEMORY_COST = config.get<number>('auth.argon.memoryCost');
const MIN_PASSWORD_SCORE = config.get<number>('auth.zxcvbn.minScore');

export const hashPassword = async (password: string): Promise<string> => {
  return argon2.hash(password, {
    type: argon2.argon2id,
    hashLength: ARGON_HASH_LENGTH,
    timeCost: ARGON_TIME_COST,
    memoryCost: ARGON_MEMORY_COST,
  });
};

export const verifyPassword = async (
  password: string,
  passwordHash: string,
): Promise<boolean> => {
  return argon2.verify(passwordHash, password);
};

// custom password Joi validator using zxcvbn
export const passwordSchema = Joi.string().custom((value, helpers) => {
  const result = zxcvbn(value);

  if (result.score < MIN_PASSWORD_SCORE) {
    return helpers.error('Password is too weak. Try making it stronger.');
  }

  return value; // Pass validation
}, 'Password Strength Validation');
