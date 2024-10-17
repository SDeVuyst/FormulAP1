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
    {
      id: 3,
      first_name: 'Lando',
      last_name: 'Norris',
      status: 'Active',
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
    },
    {
      id: 2,
      position: 2,
      points: 18,
      status: 'FIN',
      race_id: 1,
      driver_id: 2,
    },
  ],
};

const dataToDelete = {
  circuits: [1],
  races: [1],
  drivers: [1, 2, 3],
  results: [1, 2],
};

describe('Results', () => {
  let server: Server;
  let request: supertest.Agent;

  beforeAll(async () => {
    server = await createServer();
    request = supertest(server.getApp().callback());
  });

  afterAll(async () => {
    await server.stop();
  });

  // get all results
  describe('GET /api/results', () => {

    const url = '/api/results';

    beforeAll(async () => {
      await prisma.circuit.createMany({ data: data.circuits });
      await prisma.driver.createMany({ data: data.drivers });
      await prisma.race.createMany({ data: data.races });
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

    it('should 200 and return all results', async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(2);
    });
  });

  // get result by id
  describe('GET /api/results/:id', () => {

    const url = '/api/results';

    beforeAll(async () => {
      await prisma.circuit.createMany({ data: data.circuits });
      await prisma.driver.createMany({ data: data.drivers });
      await prisma.race.createMany({ data: data.races });
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

    it('should 200 and return the requested result', async () => {
      const response = await request.get(`${url}/1`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
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
  });

  // add new result
  describe('POST /api/results', () => {
    const resultsToDelete: number[] = [];
    const url = '/api/results';
  
    beforeAll(async () => {
      await prisma.circuit.createMany({ data: data.circuits });
      await prisma.driver.createMany({ data: data.drivers });
      await prisma.race.createMany({ data: data.races });
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

    it('should 201 and return the created result', async () => {
      const response = await request.post(url).send({
        position: 21,
        points: 0,
        status: 'DQ',
        race_id: 1,
        driver_id: 2,
      });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.position).toEqual(21);
      expect(response.body.status).toEqual('DQ');
      expect(response.body.race.id).toEqual(1);
      expect(response.body.driver.id).toEqual(2);      
      resultsToDelete.push(response.body.id);
    });

  });

  // update existing result
  describe('PUT /api/results/:id', () => {

    const url = '/api/results';

    beforeAll(async () => {
      await prisma.circuit.createMany({ data: data.circuits });
      await prisma.driver.createMany({ data: data.drivers });
      await prisma.race.createMany({ data: data.races });
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

    it('should 200 and return the updated result', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          position: 5,
          points: 6,
          status: 'FIN',
          race_id: 1,
          driver_id: 1,
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toEqual(1);
      expect(response.body.position).toEqual(5);
      expect(response.body.points).toEqual(6);
      expect(response.body.status).toEqual('FIN');

    });
  });

  describe('DELETE /api/results/:id', () => {

    const url = '/api/results';

    beforeAll(async () => {
      await prisma.circuit.createMany({ data: data.circuits });
      await prisma.driver.createMany({ data: data.drivers });
      await prisma.race.createMany({ data: data.races });
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

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/1`);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

  });
  
});
