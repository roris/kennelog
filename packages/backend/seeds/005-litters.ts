import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  const pairs = await knex
    .select()
    .from('pairs')
    .limit(1);

  return knex('litters')
    .del()
    .then(() => {
      return knex('litters').insert({
        parents: pairs[0].id
      });
    });
}
