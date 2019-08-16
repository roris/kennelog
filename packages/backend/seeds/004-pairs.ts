import * as Knex from 'knex';

// creates one pair
export async function seed(knex: Knex): Promise<any> {
  const sires = await knex
    .select()
    .from('dogs')
    .where({ gender: 'M' })
    .limit(1);

  const dames = await knex
    .select()
    .from('dogs')
    .where({ gender: 'F' })
    .limit(1);

  const users = await knex
    .select('id')
    .from('users')
    .where({ email: 'johnsmith@email.local' })
    .limit(1);

  // Deletes ALL existing entries
  return knex('pairs')
    .del()
    .then(() => {
      // Inserts seed entries
      return knex('pairs').insert({
        dame: dames[0].id,
        pairedOn: new Date().toISOString().substr(0, 10),
        pairedBy: users[0].id,
        sire: sires[0].id
      });
    });
}
