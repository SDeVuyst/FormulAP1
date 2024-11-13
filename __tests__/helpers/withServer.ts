// __tests__/helpers/withServer.ts
import supertest from 'supertest';
import type { Server } from '../../src/createServer';
import createServer from '../../src/createServer';
import { prisma } from '../../src/data';
import { hashPassword } from '../../src/core/password';
import Role from '../../src/core/roles';

export default function withServer(setter: (s: supertest.Agent) => void): void {
  let server: Server;

  beforeAll(async () => {
    server = await createServer();

    const passwordHash = await hashPassword('12345678');
    await prisma.driver.createMany({
      data: [
        {
          id: 1,
          first_name: 'Lewis',
          last_name: 'Hamilton',
          status: 'Active',
          email: 'lewis.hamilton@hogent.be',
          password_hash: passwordHash,
          roles: JSON.stringify([Role.USER]),
        },
        {
          id: 2,
          first_name: 'Max',
          last_name: 'Verstappen',
          status: 'Active',
          email: 'max.verstappen@hogent.be',
          password_hash: passwordHash,
          roles: JSON.stringify([Role.USER, Role.ADMIN]),
        },
      ],
    });

    setter(supertest(server.getApp().callback()));

  });

  afterAll(async () => {
    await prisma.circuit.deleteMany();
    await prisma.race.deleteMany();
    await prisma.result.deleteMany();
    await prisma.driver.deleteMany();
    await prisma.team.deleteMany();
    await prisma.car.deleteMany();

    await server.stop();
  });
}
