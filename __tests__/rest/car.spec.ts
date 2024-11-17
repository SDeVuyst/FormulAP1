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
  cars: [1, 2],
  results: [1, 2],
};

describe('Cars', () => {
  let request: supertest.Agent;
  let authHeader: string;
  let adminAuthHeader: string;

  withServer((r) => (request = r));

  beforeAll(async () => {
    authHeader = await login(request);
    adminAuthHeader = await loginAdmin(request);
  });

  const url = '/api/cars';

  // get all cars
  describe('GET /api/cars', () => {

    beforeAll(async () => {
      await prisma.team.createMany({ data: data.teams });
      await prisma.car.createMany({ data: data.cars });
    });
  
    afterAll(async () => {
      await prisma.car.deleteMany({ where: { id: { in: dataToDelete.cars } } });
      await prisma.team.deleteMany({ where: { id: { in: dataToDelete.teams } } });
    });

    it('should 200 and return all cars', async () => {
      const response = await request.get(url).set('Authorization', authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(2);
    });

    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });
  });

  // get car by id
  describe('GET /api/cars/:id', () => {

    beforeAll(async () => {
      await prisma.team.createMany({ data: data.teams });
      await prisma.car.createMany({ data: data.cars });
    });
  
    afterAll(async () => {
      await prisma.car.deleteMany({ where: { id: { in: dataToDelete.cars } } });
      await prisma.team.deleteMany({ where: { id: { in: dataToDelete.teams } } });
    });

    it('should 200 and return the requested car', async () => {
      const response = await request.get(`${url}/1`).set('Authorization', authHeader);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        model: 'model1',
        weight: 1104.6,
        year: 2014,
        team: {
          id: 2,
          name: 'RedBull Racing',
        },
      });
    });

    it('should 404 with not existing car', async () => {
      const response = await request.get(`${url}/123`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No car with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid car id', async () => {
      const response = await request.get(`${url}/invalid`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

  });

  // add new car
  describe('POST /api/cars', () => {

    beforeAll(async () => {
      await prisma.team.createMany({ data: data.teams });
      await prisma.car.createMany({ data: data.cars });
    });
  
    afterAll(async () => {
      await prisma.car.deleteMany({ where: { id: { in: dataToDelete.cars } } });
      await prisma.car.deleteMany({
        where: {
          model: 'model3',
        },
      });
      await prisma.team.deleteMany({ where: { id: { in: dataToDelete.teams } } });
    });

    it('should 201 and return the created car', async () => {
      const response = await request.post(url).send({
        model: 'model3',
        weight: 800.2,
        year: 2015,
        team_id: 1,
      }).set('Authorization', adminAuthHeader);

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.model).toEqual('model3');
      expect(response.body.year).toEqual(2015);
      expect(response.body.weight).toEqual(800.2);
      expect(response.body.team.id).toEqual(1);

    });

    it('should 400 with invalid route', async () => {
      const response = await request.get(`${url}/invalid`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    testAuthHeader(() => request.post(url));

  });

  // update existing car
  describe('PUT /api/cars/:id', () => {

    beforeAll(async () => {
      await prisma.team.createMany({ data: data.teams });
      await prisma.car.createMany({ data: data.cars });
    });
  
    afterAll(async () => {
      await prisma.car.deleteMany({ where: { id: { in: dataToDelete.cars } } });
      await prisma.team.deleteMany({ where: { id: { in: dataToDelete.teams } } });
    });

    it('should 200 and return the updated car', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          model: 'model8',
          weight: 802.2,
          year: 2014,
          team_id: 1,
        }).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toEqual(1);
      expect(response.body.model).toEqual('model8');
      expect(response.body.weight).toEqual(802.2);
      expect(response.body.year).toEqual(2014);
      expect(response.body.team.id).toEqual(1);

    });

    it('should 404 with not existing car', async () => {
      const response = await request.get(`${url}/123`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No car with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid car id', async () => {
      const response = await request.get(`${url}/invalid`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    testAuthHeader(() => request.put(`${url}/1`));

  });

  describe('DELETE /api/cars/:id', () => {

    beforeAll(async () => {
      await prisma.team.createMany({ data: data.teams });
      await prisma.car.createMany({ data: data.cars });
    });
  
    afterAll(async () => {
      await prisma.car.deleteMany({ where: { id: { in: dataToDelete.cars } } });
      await prisma.team.deleteMany({ where: { id: { in: dataToDelete.teams } } });
    });

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/1`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 404 with not existing car', async () => {
      const response = await request.delete(`${url}/123`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No car with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    testAuthHeader(() => request.delete(`${url}/1`));

  });

  describe('GET /api/cars/:id/results', () => {

    beforeAll(async () => {
      await prisma.circuit.createMany({ data: data.circuits });
      await prisma.race.createMany({ data: data.races });
      await prisma.team.createMany({ data: data.teams });
      await prisma.car.createMany({ data: data.cars });
      await prisma.result.createMany({ data: data.results });
    });
  
    afterAll(async () => {
      await prisma.result.deleteMany({
        where: { id: { in: dataToDelete.results } },
      });
      await prisma.car.deleteMany({
        where: { id: { in: dataToDelete.cars } },
      });
      await prisma.team.deleteMany({
        where: { id: { in: dataToDelete.teams } },
      });
      await prisma.race.deleteMany({
        where: { id: { in: dataToDelete.races } },
      });
      await prisma.circuit.deleteMany({
        where: { id: { in: dataToDelete.circuits } },
      });
    }); 

    it('should 200 and return the results of the given car', async () => {
      const response = await request.get(`${url}/1/results`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body.items.length).toBe(2);
      expect(response.body.items).toEqual([
        {
          id: 1,
          position: 1,
          points: 25,
          status: 'FIN',
          race: { id: 1 },
          driver: { id: 1 },
          car: { id: 1},
        },
        {
          id: 2,
          position: 2,
          points: 18,
          status: 'FIN',
          race: { id: 1 },
          driver: { id: 2 },
          car: { id: 1},
        },
      ]);

    });

    it('should 400 with invalid car id', async () => {
      const response = await request.get(`${url}/invalid/results`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    testAuthHeader(() => request.get(`${url}/1/results`));

  });
  
});
