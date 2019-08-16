import * as Knex from 'knex';
import {
  getUserByEmail,
  updateRecord,
  getEldestDogByOwnerAndGender
} from './util/common';

// creates one pair
export async function seed(knex: Knex): Promise<any> {
  const owner = await getUserByEmail(knex, 'johnsmith@email.local');
  const sire = await getEldestDogByOwnerAndGender(knex, owner.id, 'M');
  const dame = await getEldestDogByOwnerAndGender(knex, owner.id, 'F');

  // update the dame's breed
  await updateRecord(knex, 'dogs', dame.id, { breed: sire.breed });

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
