import * as Knex from 'knex';
import { updateRecord } from './util/common';

const updateDogs = (knex: Knex, pups: any[], user: number) => {
  for (let pup of pups) {
    pup.dateOfBirth = pups[0].dateOfBirth;
    pup.owner = user;
    pup.breeder = user;
    pup.breed = pups[0].breed;
    updateRecord(knex, pup.id, {
      dateOfBirth: pups[0].dateOfBirth,
      owner: user,
      breeder: user,
      breed: pups[0].breed
    });
  }

  return pups;
};

const getLitter = async (knex: Knex) => {
  const litter = await knex('litters')
    .select()
    .limit(1);
  return litter[0];
};

const getPair = async (knex: Knex, id: number) => {
  const pair = await knex
    .select()
    .from('pairs')
    .where({ id: id })
    .limit(1);

  return pair[0];
};

const getDog = async (knex: Knex, dog: number) => {
  const dogs = await knex
    .select()
    .from('dogs')
    .where({ id: dog });

  return dogs[0];
};

const getPups = async (knex: Knex, dame, sire, gender: string) => {
  return await knex
    .select()
    .from('dogs')
    .where({ gender: gender })
    .andWhere('dateOfBirth', '>', dame.dateOfBirth)
    .andWhere('dateOfBirth', '>', sire.dateOfBirth)
    .limit(2)
    .orderBy('dateOfBirth', 'desc');
};

export async function seed(knex: Knex): Promise<any> {
  const litter = await getLitter(knex);
  const pair = await getPair(knex, litter.parents);
  const sire = await getDog(knex, pair.sire);
  const dame = await getDog(knex, pair.dame);
  const malePups = await getPups(knex, dame, sire, 'M');
  const femalePups = await getPups(knex, dame, sire, 'F');

  // update the properties of the pups
  malePups[0].breed = sire.breed;
  const pups = updateDogs(knex, malePups.concat(femalePups), pair.pairedBy);

  // create a record for each selected dog
  const dogsLitters = pups.map(pup => {
    return { dog: pup.id, litter: litter.id };
  });

  return knex('dogs_litters')
    .del()
    .then(() => {
      // Inserts seed entries
      return knex('dogs_litters').insert(dogsLitters);
    });
}
