// src/data/seed.ts
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../core/password';

const prisma = new PrismaClient();

async function main() {
  // Seed circuits
  // ==========
  await prisma.circuit.createMany({
    data: [
      {
        id: 1,
        name: 'Circuit of The Americas',
        city: 'Austin',
        country: 'USA',
        active: true,
      },
      {
        id: 2,
        name: 'Circuit de Spa-Francorchamps',
        city: 'Stavelot',
        country: 'Belgium',
        active: true,
      },
      {
        id: 3,
        name: 'Circuit Zandvoort',
        city: 'Zandvoort',
        country: 'Netherlands',
        active: true,
      },
      {
        id: 4,
        name: 'Circuit Zolder',
        city: 'Heusden-Zolder',
        country: 'Belgium',
        active: false,
      },
    ],
  });

  // Seed races
  // ===========
  await prisma.race.createMany({
    data: [
      {
        id: 1,
        date: new Date(2023, 10, 22, 15, 0),
        laps: 56,
        circuit_id: 1,
      },
      {
        id: 2,
        date: new Date(2022, 10, 22, 15, 0),
        laps: 56,
        circuit_id: 1,
      },
      {
        id: 3,
        date: new Date(2024, 7, 28, 14, 0),
        laps: 44,
        circuit_id: 2,
      },
      {
        id: 4,
        date: new Date(2024, 8, 25, 14, 0),
        laps: 72,
        circuit_id: 3,
      },
    ],
  });

  // Seed drivers
  // ===========
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
        roles: ['admin', 'user'],
      },
      {
        id: 2,
        first_name: 'Max',
        last_name: 'Verstappen',
        status: 'Active',
        email: 'verstappenm@hogent.be',
        password_hash: passwordHash,
        roles: ['admin', 'user'],
      },
      {
        id: 3,
        first_name: 'Lando',
        last_name: 'Norris',
        status: 'Active',
        email: 'lando.norris@hogent.be',
        password_hash: passwordHash,
        roles: ['admin', 'user'],
      },
      {
        id: 4,
        first_name: 'Oscar',
        last_name: 'Piastri',
        status: 'Active',
        email: 'piastrioscar@hogent.be',
        password_hash: passwordHash,
        roles: ['admin', 'user'],
      },
      {
        id: 5,
        first_name: 'Charles',
        last_name: 'Leclerc',
        status: 'Active',
        email: 'leclerc.charles@hogent.be',
        password_hash: passwordHash,
        roles: ['admin', 'user'],
      },
      {
        id: 6,
        first_name: 'Ayrton',
        last_name: 'Senna',
        status: 'Retired',
        email: 'senna@hogent.be',
        password_hash: passwordHash,
        roles: ['admin', 'user'],
      },
      {
        id: 7,
        first_name: 'Michael',
        last_name: 'Schumacher',
        status: 'Retired',
        email: 'michael.schum@hogent.be',
        password_hash: passwordHash,
        roles: ['admin', 'user'],
      },
      {
        id: 8,
        first_name: 'George',
        last_name: 'Russell',
        status: 'Active',
        email: 'russ.george@hogent.be',
        password_hash: passwordHash,
        roles: ['admin', 'user'],
      },
    ],
  });

  // Seed results
  // =================
  await prisma.result.createMany({
    data: [
      // SPA 2024 RACE
      {
        id: 1,
        position: 1,
        points: 25,
        status: 'FIN',
        race_id: 3,
        driver_id: 1,
      },
      {
        id: 2,
        position: 0,
        points: 0,
        status: 'DQ',
        race_id: 3,
        driver_id: 8,
      },
      {
        id: 3,
        position: 2,
        points: 18,
        status: 'FIN',
        race_id: 3,
        driver_id: 4,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
