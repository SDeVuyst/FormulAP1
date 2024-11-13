// src/service/team.ts
import ServiceError from '../core/serviceError';
import { prisma } from '../data';
import type { Team, TeamCreateInput, TeamUpdateInput } from '../types/team';
import handleDBError from './_handleDBError';

const TEAM_SELECT = {
  id: true,
  name: true,
  country: true,
  join_date: true,
};

export const getAll = async (): Promise<Team[]> => {
  return await prisma.team.findMany({
    select: TEAM_SELECT,
  });
};

export const getById = async (id: number): Promise<Team> => {
  const team = await prisma.team.findUnique({
    where: {
      id,
    },
    select: TEAM_SELECT,
  });

  if (!team) {
    throw ServiceError.notFound('No team with this id exists');
  }

  return team;
};

export const create = async (team: TeamCreateInput): Promise<Team> => {
  try {
    return await prisma.team.create({
      data: team,
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const updateById = async ( 
  id: number,
  changes: TeamUpdateInput,
): Promise<Team> => {
  try {
    return await prisma.team.update({
      where: {
        id,
      },
      data: changes,
      select: TEAM_SELECT,
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number): Promise<void> => {
  try {
    await prisma.team.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const checkTeamExists = async (id: number) => {
  const count = await prisma.team.count({
    where: {
      id,
    },
  });

  if (count === 0) {
    throw ServiceError.notFound('No team with this id exists');
  }
};
