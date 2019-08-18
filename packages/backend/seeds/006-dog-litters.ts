import * as Knex from 'knex';
import { updateRecord } from './util/common';

const updateDogs = async (knex: Knex, pups: any[], user: number) => {
  for (let pup of pups) {
    pup.dateOfBirth = pups[0].dateOfBirth;
    pup.ownerId = user;
    pup.breederId = user;
    pup.breedId = pups[0].breedId;
    await updateRecord(knex, 'dogs', pup.id, {
      dateOfBirth: pups[0].dateOfBirth,
      ownerId: user,
      breederId: user,
      breedId: pups[0].breedId
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
  const pair = await getPair(knex, litter.pairId);
  const sire = await getDog(knex, pair.sireId);
  const dame = await getDog(knex, pair.dameId);
  const malePups = await getPups(knex, dame, sire, 'M');
  const femalePups = await getPups(knex, dame, sire, 'F');

  // update the properties of the pups
  malePups[0].breed = sire.breed;
  const pups = await updateDogs(
    knex,
    malePups.concat(femalePups),
    pair.pairedBy
  );

  // create a record for each selected dog
  const dogsLitters = pups.map(pup => {
    return { dogId: pup.id, litterId: litter.id };
  });

  await knex('dogs_litters').del();
  await knex('dogs_litters').insert(dogsLitters);

  return knex('dogs')
    .where('ownerId', sire.ownerId)
    .andWhereNot('id', sire.id)
    .andWhereNot('id', dame.id)
    .andWhereNot('id', pups[0].id)
    .andWhereNot('id', pups[1].id)
    .andWhereNot('id', pups[2].id)
    .andWhereNot('id', pups[3].id)
    .del();
}
