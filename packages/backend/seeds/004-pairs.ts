import * as Knex from 'knex';
import { getUserByEmail } from './util/common';

const getEldestDogByOwnerAndGender = async (
  knex: Knex,
  ownerId: number,
  gender: string
) => {
  const dogs = await knex
    .select()
    .from('dogs')
    .where({ owner: ownerId })
    .andWhere({ gender: gender })
    .orderBy('dateOfBirth', 'asc')
    .limit(1);
  return dogs[0];
};

// creates one pair
export async function seed(knex: Knex): Promise<any> {
  const owner = await getUserByEmail(knex, 'johnsmith@email.local');
  const sire = await getEldestDogByOwnerAndGender(knex, owner.id, 'M');
  const dame = await getEldestDogByOwnerAndGender(knex, owner.id, 'F');

  // Deletes ALL existing entries
  return knex('pairs')
    .del()
    .then(() => {
      // Inserts seed entries
      return knex('pairs').insert({
        dame: dame.id,
        pairedOn: new Date().toISOString().substr(0, 10),
        pairedBy: owner.id,
        sire: sire.id
      });
    });
}
