// src/data/mock_data.ts

export const CIRCUITS = [
  {
    id: 1,
    name: 'Circuit of The Americas',
    city: 'Austin',
    country: 'USA',
    active: true,
  },
];

export const RACES = [
  {
    id: 1,
    date: '2021-05-08T00:00:00.000Z',
    laps: 56,
    circuit: {
      id: 1,
      name: 'Circuit of The Americas',
      city: 'Austin',
      country: 'USA',
      active: true,
    },
  },
];

export const RESULTS = [
  {
    id: 1,
    position: 1,
    points: 25,
    status: 'FIN',
    race: {
      id: 1,
      date: '2021-05-08T00:00:00.000Z',
      laps: 56,
      circuit: {
        id: 1,
        name: 'Circuit of The Americas',
        city: 'Austin',
        country: 'USA',
        active: true,
      },
    },
    driver: {
      id: 1,
      first_name: 'Lewis',
      last_name: 'Hamilton',
      status: 'Active',    
    },
  },
];

export const DRIVERS = [
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
    first_name: 'Fernando',
    last_name: 'Alonso',
    status: 'Active',    
  },
  {
    id: 4,
    first_name: 'Michael',
    last_name: 'Schumacher',
    status: 'Retired',    
  },
];
