import type supertest from 'supertest';
import withServer from '../helpers/withServer';
import { loginAdmin } from '../helpers/login';
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

};

const dataToDelete = {
  circuits: [1, 2],
  races: [1, 2],
};

describe('Circuits', () => {
  let request: supertest.Agent;
  // let authHeader: string;
  let adminAuthHeader: string;

  withServer((r) => (request = r));

  beforeAll(async () => {
    // authHeader = await login(request);
    adminAuthHeader = await loginAdmin(request);
  });

  const url = '/api/circuits';

  // get all circuits
  describe('GET /api/circuits', () => {

    beforeAll(async () => {
      await prisma.circuit.createMany({ data: data.circuits });
      await prisma.race.createMany({ data: data.races });
    });
  
    afterAll(async () => {
      await prisma.race.deleteMany({ where: { id: { in: dataToDelete.races } } });
      await prisma.circuit.deleteMany({ where: { id: { in: dataToDelete.circuits } } });
    });

    it('should 200 and return all circuits', async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(2);
    });

    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });
  });

  // get circuit by id
  describe('GET /api/circuits/:id', () => {

    beforeAll(async () => {
      await prisma.circuit.createMany({ data: data.circuits });
      await prisma.race.createMany({ data: data.races });
    });
  
    afterAll(async () => {
      await prisma.race.deleteMany({ where: { id: { in: dataToDelete.races } } });
      await prisma.circuit.deleteMany({ where: { id: { in: dataToDelete.circuits } } });
    });

    it('should 200 and return the requested circuit', async () => {
      const response = await request.get(`${url}/1`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        name: 'Circuit de Spa-Francorchamps',
        city: 'Stavelot',
        country: 'Belgium',
        active: true,
      });
    });

    it('should 404 with not existing circuit', async () => {
      const response = await request.get(`${url}/123`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No circuit with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid circuit id', async () => {
      const response = await request.get(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

  });

  // add new circuit
  describe('POST /api/circuits', () => {

    beforeAll(async () => {
      await prisma.circuit.createMany({ data: data.circuits });
      await prisma.race.createMany({ data: data.races });
    });
  
    afterAll(async () => {
      await prisma.race.deleteMany({ where: { id: { in: dataToDelete.races } } });
      await prisma.circuit.deleteMany({ where: { id: { in: dataToDelete.circuits } } });

      await prisma.circuit.deleteMany({
        where: {
          id: 3,
        },
      });

    });

    it('should 201 and return the created circuit', async () => {
      const response = await request.post(url).send({
        name: 'Circuit Zolder',
        city: 'Heusden-Zolder',
        country: 'Belgium',
        active: false,
      }).set('Authorization', adminAuthHeader);

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.name).toEqual('Circuit Zolder');
      expect(response.body.city).toEqual('Heusden-Zolder');
      expect(response.body.country).toEqual('Belgium');
      expect(response.body.active).toBeFalsy();

    });

    it('should 400 with invalid route', async () => {
      const response = await request.get(`${url}/invalid`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    it('should 400 for duplicate circuit name', async () => {
      const response = await request.post(url)
        .send({
          name: 'Circuit de Spa-Francorchamps',
          city: 'Heusden-Zolder',
          country: 'Belgium',
          active: false,
        }).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        code: 'VALIDATION_FAILED',
        message: 'A circuit with this name already exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    testAuthHeader(() => request.post(url));

  });

  // update existing circuit
  describe('PUT /api/circuits/:id', () => {

    beforeAll(async () => {
      await prisma.circuit.createMany({ data: data.circuits });
      await prisma.race.createMany({ data: data.races });
    });
  
    afterAll(async () => {
      await prisma.race.deleteMany({ where: { id: { in: dataToDelete.races } } });
      await prisma.circuit.deleteMany({ where: { id: { in: dataToDelete.circuits } } });
    });

    it('should 200 and return the updated circuit', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          name: 'Circuit de Monaco',
          city: 'Monaco City',
          country: 'Monaco',
          active: true,
        }).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toEqual(1);
      expect(response.body.name).toEqual('Circuit de Monaco');
      expect(response.body.city).toEqual('Monaco City');
      expect(response.body.country).toEqual('Monaco');
      expect(response.body.active).toBeTruthy();

    });

    it('should 404 with not existing circuit', async () => {
      const response = await request.get(`${url}/123`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No circuit with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid circuit id', async () => {
      const response = await request.get(`${url}/invalid`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    it('should 400 for duplicate circuit name', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          name: 'Circuit of The Americas',
          city: 'Monaco City',
          country: 'Monaco',
          active: true,
        }).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        code: 'VALIDATION_FAILED',
        message: 'A circuit with this name already exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    testAuthHeader(() => request.put(`${url}/1`));

  });

  describe('DELETE /api/circuits/:id', () => {

    beforeAll(async () => {
      await prisma.circuit.createMany({ data: data.circuits });
      await prisma.race.createMany({ data: data.races });
    });
  
    afterAll(async () => {
      await prisma.race.deleteMany({ where: { id: { in: dataToDelete.races } } });
      await prisma.circuit.deleteMany({ where: { id: { in: dataToDelete.circuits } } });
    });

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/1`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 404 with not existing circuit', async () => {
      const response = await request.delete(`${url}/123`).set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No circuit with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    testAuthHeader(() => request.delete(`${url}/1`));

  });

  describe('GET /api/circuits/:id/races', () => {

    beforeAll(async () => {
      await prisma.circuit.createMany({ data: data.circuits });
      await prisma.race.createMany({ data: data.races });
    });
  
    afterAll(async () => {
      await prisma.race.deleteMany({ where: { id: { in: dataToDelete.races } } });
      await prisma.circuit.deleteMany({ where: { id: { in: dataToDelete.circuits } } });
    });

    // TODO: fix
    it('should 200 and return the races of the given circuit', async () => {
      const response = await request.get(`${url}/1/races`);

      expect(response.statusCode).toBe(200);
      expect(response.body.items.length).toBe(2);
      expect(response.body.items).toEqual([
        {
          id: 1,
          date: new Date(2024, 7, 28, 14, 0).toJSON(),
          laps: 44,
          circuit: {
            id: 1,
            name: 'Circuit de Spa-Francorchamps',
          },
        },
        {
          id: 2,
          date: new Date(2023, 7, 28, 14, 0).toJSON(),
          laps: 44,
          circuit: {
            id: 1,
            name: 'Circuit de Spa-Francorchamps',
          },
        },
      ]);

    });

    it('should 200 and return no races for a circuit with no races', async () => {
      const response = await request.get(`${url}/2/races`);

      expect(response.statusCode).toBe(200);
      expect(response.body.items.length).toBe(0);
      expect(response.body.items).toEqual([]);

    });

    it('should 400 with invalid circuit id', async () => {
      const response = await request.get(`${url}/invalid/races`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

  });
  
});
