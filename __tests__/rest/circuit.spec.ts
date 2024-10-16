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
      date: new Date(2023, 7, 28, 14, 0),
      laps: 43,
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
    // SPA 2024 RACE
    {
      id: 1,
      position: 1,
      points: 25,
      status: 'FIN',
      race_id: 1,
      driver_id: 1,
    },
  ],
};

const dataToDelete = {
  circuits: [1, 2],
  races: [1, 2],
  drivers: [1],
  results: [1],
};

describe('Circuits', () => {
  let server: Server;
  let request: supertest.Agent;

  beforeAll(async () => {
    server = await createServer();
    request = supertest(server.getApp().callback());
  });

  afterAll(async () => {
    await server.stop();
  });

  // get all circuits
  describe('GET /api/circuits', () => {

    const url = '/api/circuits';

    beforeAll(async () => {
      await prisma.circuit.createMany({ data: data.circuits });
    });

    afterAll(async () => {
      await prisma.circuit.deleteMany({
        where: { id: { in: dataToDelete.circuits } },
      });
    }); 

    it('should 200 and return all circuits', async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(2);
    });
  });

  // get circuit by id
  describe('GET /api/circuits/:id', () => {

    const url = '/api/circuits';

    beforeAll(async () => {
      await prisma.circuit.createMany({ data: data.circuits });
    });

    afterAll(async () => {
      await prisma.circuit.deleteMany({
        where: { id: { in: dataToDelete.circuits } },
      });
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
  });

  // add new circuit
  describe('POST /api/circuits', () => {
    const circuitsToDelete: number[] = [];
    const url = '/api/circuits';
  
    beforeAll(async () => {
      await prisma.circuit.createMany({ data: data.circuits });
    });

    afterAll(async () => {
      await prisma.circuit.deleteMany({
        where: { id: { in: dataToDelete.circuits } },
      });

      await prisma.circuit.deleteMany({
        where: { id: { in: circuitsToDelete } },
      });
    }); 

    it('should 201 and return the created circuit', async () => {
      const response = await request.post(url).send({
        name: 'Circuit Zolder',
        city: 'Heusden-Zolder',
        country: 'Belgium',
        active: false,
      });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.name).toEqual('Circuit Zolder');
      expect(response.body.city).toEqual('Heusden-Zolder');
      expect(response.body.country).toEqual('Belgium');
      expect(response.body.active).toBeFalsy();

      circuitsToDelete.push(response.body.id);
    });

  });

  // update existing circuit
  describe('PUT /api/circuits/:id', () => {

    const url = '/api/circuits';

    beforeAll(async () => {
      await prisma.circuit.createMany({ data: data.circuits });
    });

    afterAll(async () => {
      await prisma.circuit.deleteMany({
        where: { id: { in: dataToDelete.circuits } },
      });
    }); 

    it('should 200 and return the updated circuit', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          name: 'Circuit de Monaco',
          city: 'Monaco City',
          country: 'Monaco',
          active: true,
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toEqual(1);
      expect(response.body.name).toEqual('Circuit de Monaco');
      expect(response.body.city).toEqual('Monaco City');
      expect(response.body.country).toEqual('Monaco');
      expect(response.body.active).toBeTruthy();

    });
  });

  describe('DELETE /api/circuits/:id', () => {

    const url = '/api/circuits';

    beforeAll(async () => {
      await prisma.circuit.createMany({ data: data.circuits });
    });

    afterAll(async () => {
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

  describe('GET /api/circuits/:id/races', () => {
    
    const url = '/api/circuits';

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
          laps: 43,
          circuit: {
            id: 1,
            name: 'Circuit de Spa-Francorchamps',
          },
        },
      ]);

    });
  });
  
});
