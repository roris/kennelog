import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  await knex('measures').del();
  await knex('heights').del();
  await knex('weights').del();
  await knex('lengths').del();
  await knex('hip_scores').del();
  return knex('elbow_scores').del();
}
