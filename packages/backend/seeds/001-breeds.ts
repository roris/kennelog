import * as Knex from 'knex';
import breeds from './data/nomenclature.json';

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex('breeds')
    .del()
    .then(() => {
      // Inserts seed entries
      return knex('breeds').insert(breeds);
    });
}
