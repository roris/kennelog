import * as Knex from 'knex';
import { uniq, random } from 'lodash';
import { breeds } from './data/nomenclature';

const randomDate = (start, end = new Date()) => {
  return new Date(Math.ceil(random(start.getTime(), end.getTime(), false)))
    .toISOString()
    .substr(0, 10);
};

const createDog = (name = '', breed = random(1, breeds.length + 1)) => {
  return {
    name: name,
    dateOfBirth: randomDate(new Date('2001-01-01')),
    gender: Math.random() > 0.5 ? 'M' : 'F',
    owner: random(1, 4),
    breeder: random(1, 4),
    breed: breed,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

const genMicrochipNos = length =>
  Array(length)
    .fill(0)
    .map(() => `${random(100000000000000, 999999999999999)}`.substr(0, 15));

const setMicrochipNos = dogs => {
  // generate random 15 digit numbers
  const microchipNos = uniq(genMicrochipNos(dogs.length));

  return dogs.map((dog, i) => {
    // map microchips onto dogs
    dog.microChipNo = i >= microchipNos.length ? '' : microchipNos[i];
    return dog;
  });
};

const generateDogs = length => {
  // create the dogs (without microchip nos)
  const dogs = Array(length)
    .fill(0)
    .map(() => createDog());

  // return the dogs with the microchip nos
  return setMicrochipNos(dogs);
};

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex('dogs')
    .del()
    .then(async () => {
      // Inserts seed entries
      await knex('dogs').insert(generateDogs(100));
      await knex('dogs').insert(generateDogs(100));
      await knex('dogs').insert(generateDogs(100));
      await knex('dogs').insert(generateDogs(100));
      await knex('dogs').insert(generateDogs(100));
      await knex('dogs').insert(generateDogs(100));
      await knex('dogs').insert(generateDogs(100));
      await knex('dogs').insert(generateDogs(100));
      await knex('dogs').insert(generateDogs(100));
      return knex('dogs').insert(generateDogs(100));
    });
}