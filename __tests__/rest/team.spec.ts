import type supertest from 'supertest';
import withServer from '../helpers/withServer';
import { login, loginAdmin } from '../helpers/login';
import testAuthHeader from '../helpers/testAuthHeader';
import { prisma } from '../../src/data';

const data ={
  circuits: [
    {
      id: 1,
      name: 'Circuit de Spa-Francorchamps',
      city: 'Stavelot',
      country: 'Belgium',
      active: true,
    },
    {
      id: 2,
      name: 'Circuit of The Americas',
      city: 'Austin',
      country: 'USA',
      active: true,
    },
  ],

  races: [
    {
      id: 1,
      date: new Date(2024, 7, 28, 14, 0),
      laps: 44,
      circuit_id: 1,
    },
    {
      id: 2,
      date: new Date(2023, 7, 28, 14, 0),
      laps: 44,
      circuit_id: 1,
    },
  ],

  teams: [
    {
      id: 2,
      name: 'Red Bull',
      country: 'Austria',
      join_date: new Date(2000, 1, 1, 0, 0),
    },
    {
      id: 3,
      name: 'Mercedes',
      country: 'Germany',
      join_date: new Date(2001, 1, 1, 0, 0),
    },
  ],

  cars: [
    {
      id: 1,
      model: 'model1',
      weight: 1104.6,
      year: 2014,
      team_id: 2,
    },
    {
      id: 2,
      model: 'model2',
      weight: 999.87,
      year: 2018,
      team_id: 2,
    },
  ],

};

const dataToDelete = {
  circuits: [1, 2],
  races: [1, 2],
  teams: [2, 3],
  cars: [1, 2],
};

describe('Teams', () => {
  let request: supertest.Agent;
  let authHeader: string;
  let adminAuthHeader: string;

  withServer((r) => (request = r));

  beforeAll(async () => {
    authHeader = await login(request);
    adminAuthHeader = await loginAdmin(request);
  });

  const url = '/api/teams';

  // get all teams
  describe('GET /api/teams', () => {

    beforeAll(async () => {
      await prisma.team.createMany({ data: data.teams });
    });
  
    afterAll(async () => {
      await prisma.team.deleteMany({ where: { id: { in: dataToDelete.teams } } });
    });

    it('should 200 and return all teams', async () => {
      const response = await request.get(url).set('Authorization', authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(3);
    });

    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });
  });

  // get teams by id
  describe('GET /api/teams/:id', () => {

    beforeAll(async () => {
      await prisma.team.createMany({ data: data.teams });
    });
  
    afterAll(async () => {
      await prisma.team.deleteMany({ where: { id: { in: dataToDelete.teams } } });
    });

    it('should 200 and return the requested team', async () => {
      const response = await request.get(`${url}/1`).set('Authorization', authHeader);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        name: 'Ferrari',
        country: 'Italy',
        join_date: '1972-01-31T23:00:00.000Z',
      });
    });

    it('should 404 with not existing team', async () => {
      const response = await request.get(`${url}/123`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No team with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid team id', async () => {
      const response = await request.get(`${url}/invalid`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

  });

  // add new team
  describe('POST /api/teams', () => {

    beforeAll(async () => {
      await prisma.team.createMany({ data: data.teams });
    });
  
    afterAll(async () => {
      await prisma.team.deleteMany({ where: { id: { in: dataToDelete.teams } } });
      await prisma.team.deleteMany({
        where: {
          name: 'Alpine',
        },
      });
    });

    it('should 201 and return the created team', async () => {
      const response = await request.post(url).send({
        name: 'Alpine',
        country: 'France',
        join_date: '2021-05-27T13:00:00.000Z',
      }).set('Authorization', adminAuthHeader);

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.name).toEqual('Alpine');
      expect(response.body.country).toEqual('France');
      expect(response.body.join_date).toEqual('2021-05-27T13:00:00.000Z');

    });

    it('should 400 with invalid route', async () => {
      const response = await request.get(`${url}/invalid`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    it('should 400 for duplicate team name', async () => {
      const response = await request.post(url)
        .send({
          name: 'Ferrari',
          country: 'France',
          join_date: '2021-05-27T13:00:00.000Z',
        }).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        code: 'VALIDATION_FAILED',
        message: 'A team with this name already exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    testAuthHeader(() => request.post(url));

  });

  // update existing team
  describe('PUT /api/teams/:id', () => {

    beforeAll(async () => {
      await prisma.team.createMany({ data: data.teams });
    });
  
    afterAll(async () => {
      await prisma.team.deleteMany({ where: { id: { in: dataToDelete.teams } } });
    });

    it('should 200 and return the updated team', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          name: 'Ferrari',
          country: 'CHANGED',
          join_date: '2021-05-27T13:00:00.000Z',
        }).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toEqual(1);
      expect(response.body.name).toEqual('Ferrari');
      expect(response.body.country).toEqual('CHANGED');
      expect(response.body.join_date).toEqual('2021-05-27T13:00:00.000Z');

    });

    it('should 404 with not existing team', async () => {
      const response = await request.put(`${url}/123`)
        .send({
          name: 'Ferrari',
          country: 'CHANGED',
          join_date: '2021-05-27T13:00:00.000Z',
        })
        .set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No team with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid team id', async () => {
      const response = await request.put(`${url}/invalid`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    it('should 400 for duplicate team name', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          name: 'Red Bull',
          country: 'France',
          join_date: '2021-05-27T13:00:00.000Z',
        }).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        code: 'VALIDATION_FAILED',
        message: 'A team with this name already exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    testAuthHeader(() => request.put(`${url}/1`));

  });

  describe('DELETE /api/teams/:id', () => {

    beforeAll(async () => {
      await prisma.team.createMany({ data: data.teams });
    });
  
    afterAll(async () => {
      await prisma.team.deleteMany({ where: { id: { in: dataToDelete.teams } } });
    });

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/2`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 404 with not existing team', async () => {
      const response = await request.delete(`${url}/123`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No team with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    testAuthHeader(() => request.delete(`${url}/1`));

  });

  describe('GET /api/teams/:id/drivers', () => { 

    beforeAll(async () => {
      await prisma.team.createMany({ data: data.teams });
    });
  
    afterAll(async () => {
      await prisma.team.deleteMany({ where: { id: { in: dataToDelete.teams } } });
    });

    it('should 200 and return the drivers of the given team', async () => {
      const response = await request.get(`${url}/1/drivers`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body.items.length).toBe(1);
      expect(response.body.items).toEqual([
        {
          id: 1,
          first_name: 'Lewis',
          last_name: 'Hamilton',
          status: 'Active',
          email: 'lewis.hamilton@hogent.be',
          team: {
            id: 1,
            name: 'Ferrari',
          },
        },
      ]);

    });

    it('should 403 when not an admin and not own user id', async () => {
      const response = await request.get(`${url}/1/drivers`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        code: 'FORBIDDEN',
        message: 'You are not allowed to view this part of the application',
      });
    });

    it('should 400 with invalid team id', async () => {
      const response = await request.get(`${url}/invalid/drivers`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    testAuthHeader(() => request.get(`${url}/1/drivers`));

  });

  describe('GET /api/teams/:id/cars', () => {

    beforeAll(async () => {
      await prisma.team.createMany({ data: data.teams });
      await prisma.car.createMany({ data: data.cars });
    });
  
    afterAll(async () => {
      await prisma.car.deleteMany({
        where: { id: { in: dataToDelete.cars } },
      });
      await prisma.team.deleteMany({
        where: { id: { in: dataToDelete.teams } },
      });
    }); 

    it('should 200 and return the cars of the given team', async () => {
      const response = await request.get(`${url}/2/cars`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body.items.length).toBe(2);
      expect(response.body.items).toEqual([
        {
          id: 1,
          model: 'model1',
          team: { 
            id: 2,
            name: 'Red Bull',
          },
          weight: 1104.6,
          year: 2014,
        },
        {
          id: 2,
          model: 'model2',
          team: { 
            id: 2,
            name: 'Red Bull',
          },
          weight: 999.87,
          year: 2018,
        },
      ]);

    });

    it('should 400 with invalid team id', async () => {
      const response = await request.get(`${url}/invalid/cars`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    testAuthHeader(() => request.get(`${url}/1/cars`));

  });
  
});
