// src/data/seed.ts
import { PrismaClient } from '@prisma/client';

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

  // Seed results
  // =================
  await prisma.result.createMany({
    // TODO
    data: [
        
    ],
  });

  // Seed drivers
  // ===========
  await prisma.driver.createMany({
    data: [
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
      {
        id: 4,
        first_name: 'Oscar',
        last_name: 'Piastri',
        status: 'Active',
      },
      {
        id: 5,
        first_name: 'Charles',
        last_name: 'Leclerc',
        status: 'Active',
      },
      {
        id: 6,
        first_name: 'Ayrton',
        last_name: 'Senna',
        status: 'Retired',
      },
      {
        id: 7,
        first_name: 'Michael',
        last_name: 'Schumacher',
        status: 'Retired',
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
