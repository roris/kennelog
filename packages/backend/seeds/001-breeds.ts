import * as Knex from 'knex';
import { ImageNetClasses } from '../src/services/classifier/imagenet-classes';

const breeds = Object.entries(ImageNetClasses).map(entry => {
  const breed = { name: entry[1] };
  return breed;
});

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex('breeds')
    .del()
    .then(() => {
      // Inserts seed entries
      return knex('breeds').insert(breeds);
    });
}
