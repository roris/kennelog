import * as Knex from 'knex';
import { insertMeasures, mergeIdAndData } from './util/common';

export async function seed(knex: Knex): Promise<any> {
  const measures = await insertMeasures(knex);

  const data = mergeIdAndData(measures, [
    { length: 60 },
    { length: 90 },
    { length: 100 }
  ]);

  return knex('lengths').insert(data);
}
