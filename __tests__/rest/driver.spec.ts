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

  drivers: [
    {
      id: 1,
      first_name: 'Lewis',
      last_name: 'Hamilton',
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
      race_id: 2,
      driver_id: 1,
    },
  ],
};

const dataToDelete = {
  circuits: [1],
  races: [1, 2],
  drivers: [1],
  results: [1, 2],
};

describe('Drivers', () => {
  let server: Server;
  let request: supertest.Agent;

  beforeAll(async () => {
    server = await createServer();
    request = supertest(server.getApp().callback());
  });

  afterAll(async () => {
    await server.stop();
  });

  // get all drivers
  describe('GET /api/drivers', () => {

    const url = '/api/drivers';

    beforeAll(async () => {
      await prisma.driver.createMany({ data: data.drivers });
    });

    afterAll(async () => {
      await prisma.driver.deleteMany({
        where: { id: { in: dataToDelete.drivers } },
      });
    }); 

    it('should 200 and return all drivers', async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(1);
    });
  });

  // get driver by id
  describe('GET /api/drivers/:id', () => {

    const url = '/api/drivers';

    beforeAll(async () => {
      await prisma.driver.createMany({ data: data.drivers });
    });

    afterAll(async () => {
      await prisma.driver.deleteMany({
        where: { id: { in: dataToDelete.drivers } },
      });
    }); 

    it('should 200 and return the requested driver', async () => {
      const response = await request.get(`${url}/1`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        first_name: 'Lewis',
        last_name: 'Hamilton',
        status: 'Active',
      });
    });
  });

  // add new driver
  describe('POST /api/drivers', () => {
    const driversToDelete: number[] = [];
    const url = '/api/drivers';
  
    beforeAll(async () => {
      await prisma.driver.createMany({ data: data.drivers });
    });

    afterAll(async () => {
      await prisma.driver.deleteMany({
        where: { id: { in: dataToDelete.drivers } },
      });

      await prisma.driver.deleteMany({
        where: { id: { in: driversToDelete } },
      });
    }); 

    it('should 201 and return the created driver', async () => {
      const response = await request.post(url).send({
        first_name: 'Oscar',
        last_name: 'Piastri',
        status: 'Active',
      });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.first_name).toEqual('Oscar');
      expect(response.body.last_name).toEqual('Piastri');
      expect(response.body.status).toEqual('Active');

      driversToDelete.push(response.body.id);
    });

  });

  // update existing driver
  describe('PUT /api/drivers/:id', () => {

    const url = '/api/drivers';

    beforeAll(async () => {
      await prisma.driver.createMany({ data: data.drivers });
    });

    afterAll(async () => {
      await prisma.driver.deleteMany({
        where: { id: { in: dataToDelete.drivers } },
      });
    }); 

    it('should 200 and return the updated driver', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          first_name: 'Lando',
          last_name: 'Norris',
          status: 'Active',
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toEqual(1);
      expect(response.body.first_name).toEqual('Lando');
      expect(response.body.last_name).toEqual('Norris');
      expect(response.body.status).toEqual('Active');

    });
  });

  describe('DELETE /api/drivers/:id', () => {

    const url = '/api/drivers';

    beforeAll(async () => {
      await prisma.driver.createMany({ data: data.drivers });
    });

    afterAll(async () => {
      await prisma.driver.deleteMany({
        where: { id: { in: dataToDelete.drivers } },
      });
    }); 

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/1`);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

  });

  describe('GET /api/drivers/:id/results', () => {
    
    const url = '/api/drivers';

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
          race: {
            id: 1,
          },
          driver: {
            id: 1,
          },
        },
        {
          id: 2,
          position: 3,
          points: 15,
          status: 'FIN',
          race: {
            id: 2,
          },
          driver: {
            id: 1,
          },
        },
      ]);

    });
  });
  
});
