import * as Knex from 'knex';
import { insertMeasures, mergeIdAndData } from './util/common';

export async function seed(knex: Knex): Promise<any> {
  const measures = await insertMeasures(knex);

  const data = mergeIdAndData(measures, [
    { weight: 20 },
    { weight: 30 },
    { weight: 40 }
  ]);

  return knex('weights').insert(data);
}
