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

  results: [
    {
      id: 1,
      position: 1,
      points: 25,
      status: 'FIN',
      race_id: 1,
      driver_id: 2,
    },
    {
      id: 2,
      position: 3,
      points: 15,
      status: 'FIN',
      race_id: 2,
      driver_id: 2,
    },
  ],

};

const dataToDelete = {
  circuits: [1, 2],
  races: [1, 2],
  results: [1, 2],
};

describe('Drivers', () => {
  let request: supertest.Agent;
  let authHeader: string;
  let adminAuthHeader: string;

  withServer((r) => (request = r));

  beforeAll(async () => {
    authHeader = await login(request);
    adminAuthHeader = await loginAdmin(request);
  });

  const url = '/api/drivers';

  // get all drivers
  describe('GET /api/drivers', () => {

    it('should 200 and return all drivers for an admin', async () => {
      const response = await request.get(url).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body.items.length).toBe(2);
      expect(response.body.items).toEqual(expect.arrayContaining([{
        id: 1,
        first_name: 'Lewis',
        last_name: 'Hamilton',
        status: 'Active',
        email: 'lewis.hamilton@hogent.be',
      },
      {
        id: 2,
        first_name: 'Max',
        last_name: 'Verstappen',
        status: 'Active',
        email: 'max.verstappen@hogent.be',
      }]));
    });

    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });

    it('should 403 when not an admin', async () => {
      const response = await request.get(url).set('Authorization', authHeader);

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        code: 'FORBIDDEN',
        message: 'You are not allowed to view this part of the application',
      });
    });

    testAuthHeader(() => request.get(url));

  });

  // get driver by id
  describe('GET /api/drivers/:id', () => {

    it('should 200 and return the requested user', async () => {
      const response = await request.get(`${url}/1`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        id: 1,
        first_name: 'Lewis',
        last_name: 'Hamilton',
        status: 'Active',
        email: 'lewis.hamilton@hogent.be',
      });
    });

    it('should 200 and return my user info when passing \'me\' as id', async () => {
      const response = await request.get(`${url}/me`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        id: 1,
        first_name: 'Lewis',
        last_name: 'Hamilton',
        status: 'Active',
        email: 'lewis.hamilton@hogent.be',
      });
    });

    it('should 404 with not existing user (and admin user requesting)', async () => {
      const response = await request.get(`${url}/123`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No driver with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid user id (and admin user requesting)', async () => {
      const response = await request.get(`${url}/invalid`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    it('should 403 when not an admin and not own user id', async () => {
      const response = await request.get(`${url}/2`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        code: 'FORBIDDEN',
        message: 'You are not allowed to view this driver\'s information',
      });
    });

    testAuthHeader(() => request.get(`${url}/1`));

  });

  // add new driver
  describe('POST /api/drivers', () => {

    afterAll(async () => {
      await prisma.driver.deleteMany({
        where: {
          email: 'new.driver@hogent.be',
        },
      });
    });

    it('should 200 and return the registered driver', async () => {
      const response = await request.post(url)
        .send({
          first_name: 'New',
          last_name: 'Driver',
          email: 'new.driver@hogent.be',
          password: 'AtendOMIStroRTE',
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body.token).toBeDefined();
    });

    testAuthHeader(() => request.post(url));
  });

  // update existing driver
  describe('PUT /api/drivers/:id', () => {

    it('should 200 and return the updated user', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          first_name: 'Changed',
          last_name: 'Hamilton',
          status: 'Retired',
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        first_name: 'Changed',
        last_name: 'Hamilton',
        status: 'Retired',
        email: 'lewis.hamilton@hogent.be',
      });
    });

    it('should 403 when not an admin and not own user id', async () => {
      const response = await request.put(`${url}/2`)
        .send({
          first_name: 'Changed',
          last_name: 'Hamilton',
          status: 'Retired',
        })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        code: 'FORBIDDEN',
        message: 'You are not allowed to view this driver\'s information',
      });
    });

    testAuthHeader(() => request.put(`${url}/1`));

  });

  describe('DELETE /api/drivers/:id', () => {

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/1`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 404 with not existing user', async () => {
      const response = await request.delete(`${url}/123`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No driver with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 403 when not an admin and not own user id', async () => {
      const response = await request.delete(`${url}/2`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        code: 'FORBIDDEN',
        message: 'You are not allowed to view this driver\'s information',
      });
    });

    testAuthHeader(() => request.delete(`${url}/1`));

  });

  describe('GET /api/drivers/:id/results', () => {

    beforeAll(async () => {
      await prisma.circuit.createMany({ data: data.circuits });
      await prisma.race.createMany({ data: data.races });
      await prisma.result.createMany({ data: data.results });      
    });

    afterAll(async () => {
      await prisma.result.deleteMany({ where: { id: { in: dataToDelete.results } } });
      await prisma.race.deleteMany({ where: { id: { in: dataToDelete.races } } });
      await prisma.circuit.deleteMany({ where: { id: { in: dataToDelete.circuits } } });
    });

    it('should 200 and return results', async () => {
      const response = await request.get(`${url}/2/results`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body.items.length).toBe(2);
      expect(response.body.items).toEqual(expect.arrayContaining([{
        id: 1,
        position: 1,
        points: 25,
        status: 'FIN',
        race: { id: 1 },
        driver: { id: 2 },
      },
      {
        id: 2,
        position: 3,
        points: 15,
        status: 'FIN',
        race: { id: 2 },
        driver: { id: 2},
      }]));
    });

    it('should 404 with not existing user', async () => {
      const response = await request.get(`${url}/123/results`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No driver with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 403 when not an admin and not own user id', async () => {
      const response = await request.get(`${url}/2/results`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        code: 'FORBIDDEN',
        message: 'You are not allowed to view this driver\'s information',
      });
    });

    it('should 400 with invalid user id', async () => {
      const response = await request.get(`${url}/invalid/results`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    testAuthHeader(() => request.get(`${url}/1/results`));

  });
  
});
