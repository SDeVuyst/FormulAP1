import type supertest from 'supertest';
import withServer from '../helpers/withServer';
import { login, loginAdmin } from '../helpers/login';
import testAuthHeader from '../helpers/testAuthHeader';
import { prisma } from '../../src/data';

const data = {
  circuits: [
    {
      id: 1,
      name: 'Circuit de Spa-Francorchamps',
      city: 'Stavelot',
      country: 'Belgium',
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
  ],

  teams: [
    {
      id: 2,
      name: 'RedBull Racing',
      country: 'Austria',
      join_date: new Date(2017, 1, 1, 0, 0),
    },
  ],

  cars: [
    {
      id: 1,
      model: 'model1',
      weight: 1104.6,
      year: 2014,
      team_id: 1,
    },
  ],

  results: [
    // SPA 2024 RACE
    {
      id: 1,
      position: 1,
      points: 25,
      status: 'FIN',
      race_id: 1,
      driver_id: 1,
      car_id: 1,
    },
    {
      id: 2,
      position: 2,
      points: 18,
      status: 'FIN',
      race_id: 1,
      driver_id: 2,
      car_id: 1,
    },
  ],
};

const dataToDelete = {
  circuits: [1],
  races: [1],
  teams: [2],
  cars: [1],
  results: [1, 2],
};

describe('Results', () => {
  let request: supertest.Agent;
  let authHeader: string;
  let adminAuthHeader: string;

  withServer((r) => (request = r));

  beforeAll(async () => {
    authHeader = await login(request);
    adminAuthHeader = await loginAdmin(request);
  });

  const url = '/api/results';

  // get all results
  describe('GET /api/results', () => {

    beforeAll(async () => {
      await prisma.team.createMany({ data: data.teams });
      await prisma.circuit.createMany({ data: data.circuits });
      await prisma.race.createMany({ data: data.races });
      await prisma.car.createMany({ data: data.cars });
      await prisma.result.createMany({ data: data.results });
    });

    afterAll(async () => {
      await prisma.result.deleteMany({
        where: { id: { in: dataToDelete.results } },
      });
      await prisma.race.deleteMany({
        where: { id: { in: dataToDelete.races } },
      });
      await prisma.car.deleteMany({
        where: { id: { in: dataToDelete.cars } },
      });
      await prisma.team.deleteMany({
        where: { id: { in: dataToDelete.teams } },
      });
      await prisma.circuit.deleteMany({
        where: { id: { in: dataToDelete.circuits } },
      });
    }); 

    it('should 200 and return all results for the signed in user', async () => {
      const response = await request.get(url).set('Authorization', authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(1);
    });

    it('should 200 and return all results', async () => {
      const response = await request.get(url).set('Authorization', adminAuthHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(2);
    });

    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');

    });

    testAuthHeader(() => request.get(url));

  });

  // get result by id
  describe('GET /api/results/:id', () => {

    const url = '/api/results';

    beforeAll(async () => {
      await prisma.team.createMany({ data: data.teams });
      await prisma.circuit.createMany({ data: data.circuits });
      await prisma.race.createMany({ data: data.races });
      await prisma.car.createMany({ data: data.cars });
      await prisma.result.createMany({ data: data.results });
    });

    afterAll(async () => {
      await prisma.result.deleteMany({
        where: { id: { in: dataToDelete.results } },
      });
      await prisma.race.deleteMany({
        where: { id: { in: dataToDelete.races } },
      });
      await prisma.car.deleteMany({
        where: { id: { in: dataToDelete.cars } },
      });
      await prisma.team.deleteMany({
        where: { id: { in: dataToDelete.teams } },
      });
      await prisma.circuit.deleteMany({
        where: { id: { in: dataToDelete.circuits } },
      });
    }); 

    it('should 200 and return the requested result', async () => {
      const response = await request.get(`${url}/1`).set('Authorization', authHeader);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        car: {
          id: 1,
        },
        driver: {
          id: 1,
        },
        points: 25,
        position: 1,
        race: {
          id: 1,
        },
        status: 'FIN',
      });
    });

    it('should 404 with not existing result', async () => {
      const response = await request.get(`${url}/123`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No result with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with result user id', async () => {
      const response = await request.get(`${url}/invalid`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    testAuthHeader(() => request.get(`${url}/1`));

  });

  // add new result
  describe('POST /api/results', () => {
  
    beforeAll(async () => {
      await prisma.team.createMany({ data: data.teams });
      await prisma.circuit.createMany({ data: data.circuits });
      await prisma.race.createMany({ data: data.races });
      await prisma.car.createMany({ data: data.cars });
      await prisma.result.createMany({ data: data.results });
    });

    afterAll(async () => {
      await prisma.result.deleteMany({
        where: { id: { in: dataToDelete.results } },
      });
      await prisma.race.deleteMany({
        where: { id: { in: dataToDelete.races } },
      });
      await prisma.car.deleteMany({
        where: { id: { in: dataToDelete.cars } },
      });
      await prisma.team.deleteMany({
        where: { id: { in: dataToDelete.teams } },
      });
      await prisma.circuit.deleteMany({
        where: { id: { in: dataToDelete.circuits } },
      });

      await prisma.circuit.deleteMany({
        where: {
          id: 3,
        },
      });

    }); 

    it('should 201 and return the created result', async () => {
      const response = await request.post(url).send({
        position: 21,
        points: 0,
        status: 'DQ',
        race_id: 1,
        driver_id: 2,
        car_id: 1,
      }).set('Authorization', adminAuthHeader);

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.position).toEqual(21);
      expect(response.body.status).toEqual('DQ');
      expect(response.body.race.id).toEqual(1);
      expect(response.body.driver.id).toEqual(2);
      expect(response.body.car.id) .toEqual(1);
    });

    it('should 400 with invalid route', async () => {
      const response = await request.get(`${url}/invalid`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');

    });
    testAuthHeader(() => request.get(url));
  });

  // update existing result
  describe('PUT /api/results/:id', () => {

    beforeAll(async () => {
      await prisma.team.createMany({ data: data.teams });
      await prisma.circuit.createMany({ data: data.circuits });
      await prisma.race.createMany({ data: data.races });
      await prisma.car.createMany({ data: data.cars });
      await prisma.result.createMany({ data: data.results });
    });

    afterAll(async () => {
      await prisma.result.deleteMany({
        where: { id: { in: dataToDelete.results } },
      });
      await prisma.race.deleteMany({
        where: { id: { in: dataToDelete.races } },
      });
      await prisma.car.deleteMany({
        where: { id: { in: dataToDelete.cars } },
      });
      await prisma.team.deleteMany({
        where: { id: { in: dataToDelete.teams } },
      });
      await prisma.circuit.deleteMany({
        where: { id: { in: dataToDelete.circuits } },
      });
    });  

    it('should 200 and return the updated result', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          position: 5,
          points: 6,
          status: 'FIN',
          race_id: 1,
          driver_id: 1,
          car_id: 1,
        }).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toEqual(1);
      expect(response.body.position).toEqual(5);
      expect(response.body.points).toEqual(6);
      expect(response.body.status).toEqual('FIN');

    });

    it('should 404 with not existing result', async () => {
      const response = await request.get(`${url}/123`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No result with this id exists',
      });
      expect(response.body.stack).toBeTruthy();

    });

    it('should 400 with invalid result id', async () => {
      const response = await request.get(`${url}/invalid`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');

    });

    testAuthHeader(() => request.get(`${url}/1`));
  });

  describe('DELETE /api/results/:id', () => {

    beforeAll(async () => {
      await prisma.team.createMany({ data: data.teams });
      await prisma.circuit.createMany({ data: data.circuits });
      await prisma.race.createMany({ data: data.races });
      await prisma.car.createMany({ data: data.cars });
      await prisma.result.createMany({ data: data.results });
    });

    afterAll(async () => {
      await prisma.result.deleteMany({
        where: { id: { in: dataToDelete.results } },
      });
      await prisma.race.deleteMany({
        where: { id: { in: dataToDelete.races } },
      });
      await prisma.car.deleteMany({
        where: { id: { in: dataToDelete.cars } },
      });
      await prisma.team.deleteMany({
        where: { id: { in: dataToDelete.teams } },
      });
      await prisma.circuit.deleteMany({
        where: { id: { in: dataToDelete.circuits } },
      });
    }); 

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/1`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 404 with not existing result', async () => {
      const response = await request.delete(`${url}/123`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No result with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    testAuthHeader(() => request.get(`${url}/1`));

  });
  
});
