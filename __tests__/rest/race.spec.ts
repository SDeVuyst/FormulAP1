import supertest from 'supertest';
import createServer from '../../src/createServer';
import type { Server } from '../../src/createServer';
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
      date: new Date(2024, 7, 28, 14, 0),
      laps: 44,
      circuit_id: 2,
    },
  ],

  drivers: [
    {
      id: 1,
      first_name: 'Lewis',
      last_name: 'Hamilton',
      status: 'Active',
    },
    {
      id: 2,
      first_name: 'Max',
      last_name: 'Verstappen',
      status: 'Active',
    },
  ],

  results: [
    {
      id: 1,
      position: 1,
      points: 25,
      status: 'FIN',
      race_id: 1,
      driver_id: 1,
    },
    {
      id: 2,
      position: 3,
      points: 15,
      status: 'FIN',
      race_id: 1,
      driver_id: 2,
    },
  ],
};

const dataToDelete = {
  circuits: [1, 2],
  races: [1, 2],
  drivers: [1, 2],
  results: [1, 2],
};

describe('Races', () => {
  let server: Server;
  let request: supertest.Agent;

  beforeAll(async () => {
    server = await createServer();
    request = supertest(server.getApp().callback());
  });

  afterAll(async () => {
    await server.stop();
  });

  // get all races
  describe('GET /api/races', () => {

    const url = '/api/races';

    beforeAll(async () => {
      await prisma.circuit.createMany({ data: data.circuits });
      await prisma.race.createMany({ data: data.races });
    });

    afterAll(async () => {
      await prisma.race.deleteMany({
        where: { id: { in: dataToDelete.races } }, 
      });
      await prisma.circuit.deleteMany({
        where: { id: { in: dataToDelete.circuits } },
      });
    }); 

    it('should 200 and return all races', async () => {
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

  // get race by id
  describe('GET /api/races/:id', () => {

    const url = '/api/races';

    beforeAll(async () => {
      await prisma.circuit.createMany({ data: data.circuits });
      await prisma.race.createMany({ data: data.races });
    });

    afterAll(async () => {
      await prisma.race.deleteMany({
        where: { id: { in: dataToDelete.races } },
      });
      await prisma.circuit.deleteMany({
        where: { id: { in: dataToDelete.circuits } },
      });
    }); 

    it('should 200 and return the requested race', async () => {
      const response = await request.get(`${url}/1`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        date: new Date(2024, 7, 28, 14, 0).toJSON(),
        laps: 44,
        circuit: {
          id: 1,
          name: 'Circuit de Spa-Francorchamps',
        },
      });
    });

    it('should 404 with not existing race', async () => {
      const response = await request.get(`${url}/123`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No race with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid race id', async () => {
      const response = await request.get(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

  });

  // add new race
  describe('POST /api/races', () => {
    const racesToDelete: number[] = [];
    const url = '/api/races';
  
    beforeAll(async () => {
      await prisma.circuit.createMany({ data: data.circuits });
      await prisma.race.createMany({ data: data.races });
    });

    afterAll(async () => {
      await prisma.race.deleteMany({
        where: { id: { in: dataToDelete.races } },
      });

      await prisma.race.deleteMany({
        where: { id: { in: racesToDelete } },
      });

      await prisma.circuit.deleteMany({
        where: { id: { in: dataToDelete.circuits } },
      });
    }); 

    it('should 201 and return the created race', async () => {
      const response = await request.post(url).send({
        date: '2021-05-27T13:00:00.000Z',
        laps: 72,
        circuit_id: 1,
      });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.laps).toEqual(72);
      expect(response.body.date).toBe('2021-05-27T13:00:00.000Z');
      expect(response.body.circuit).toEqual({
        id: 1,
        name: 'Circuit de Spa-Francorchamps',
      });
      racesToDelete.push(response.body.id);
    });

    it('should 400 with invalid route', async () => {
      const response = await request.get(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

  });

  // update existing race
  describe('PUT /api/races/:id', () => {

    const url = '/api/races';

    beforeAll(async () => {
      await prisma.circuit.createMany({ data: data.circuits });
      await prisma.race.createMany({ data: data.races });
    });

    afterAll(async () => {
      await prisma.race.deleteMany({
        where: { id: { in: dataToDelete.races } },
      });
      await prisma.circuit.deleteMany({
        where: { id: { in: dataToDelete.circuits } },
      });
    }); 

    it('should 200 and return the updated race', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          date: '2021-05-27T13:00:00.000Z',
          laps: 45,
          circuit_id: 2,
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toEqual(1);
      expect(response.body.date).toBe('2021-05-27T13:00:00.000Z');
      expect(response.body.laps).toBe(45);
      expect(response.body.circuit).toEqual({
        id: 2,
        name: 'Circuit of The Americas',
      });

    });

    it('should 404 with not existing race', async () => {
      const response = await request.get(`${url}/123`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No race with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid race id', async () => {
      const response = await request.get(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

  });

  describe('DELETE /api/races/:id', () => {

    const url = '/api/races';

    beforeAll(async () => {
      await prisma.circuit.createMany({ data: data.circuits });
      await prisma.race.createMany({ data: data.races });
    });

    afterAll(async () => {
      await prisma.race.deleteMany({
        where: { id: { in: dataToDelete.races } },
      });
      await prisma.circuit.deleteMany({
        where: { id: { in: dataToDelete.circuits } },
      });
    }); 

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/1`);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 404 with not existing race', async () => {
      const response = await request.delete(`${url}/123`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No race with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

  });
  
  describe('GET /api/races/:id/results', () => {
    
    const url = '/api/races';

    beforeAll(async () => {
      await prisma.circuit.createMany({ data: data.circuits });
      await prisma.race.createMany({ data: data.races });
      await prisma.driver.createMany({ data: data.drivers });
      await prisma.result.createMany({ data: data.results });
    });

    afterAll(async () => {
      await prisma.result.deleteMany({
        where: { id: { in: dataToDelete.results } },
      });
      await prisma.driver.deleteMany({
        where: { id: { in: dataToDelete.drivers } },
      });
      await prisma.race.deleteMany({
        where: { id: { in: dataToDelete.races } },
      });
      await prisma.circuit.deleteMany({
        where: { id: { in: dataToDelete.circuits } },
      });
    }); 

    it('should 200 and return the results of the given driver', async () => {
      const response = await request.get(`${url}/1/results`);

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
        },
        {
          id: 2,
          position: 3,
          points: 15,
          status: 'FIN',
          race: { id: 1 },
          driver: { id: 2 },
        },
      ]);

    });

    it('should 400 with invalid race id', async () => {
      const response = await request.get(`${url}/invalid/results`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

  });
});
