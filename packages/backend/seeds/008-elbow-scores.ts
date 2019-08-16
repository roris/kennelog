import * as Knex from 'knex';
import { insertMeasures, mergeIdAndData } from './util/common';

export async function seed(knex: Knex): Promise<any> {
  const measures = await insertMeasures(knex);

  const data = mergeIdAndData(measures, [
    { right: 1, left: 2 },
    { right: 5, left: 4 },
    { right: 5, left: 5 }
  ]);

  return knex('elbow_scores').insert(data);
}
