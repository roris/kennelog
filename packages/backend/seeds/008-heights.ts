import * as Knex from 'knex';
import { getUserByEmail, getRecord, insertMeasures } from './util/common';

const merge = (measures: any[], scores: any[]) => {
  const shorter = measures.length < scores.length ? measures : scores;
  const data = new Array(shorter.length);

  // merge the arrays
  for (let i = 0; i < data.length; ++i) {
    data[i] = {
      id: measures[i],
      height: scores[i]
    };
  }

  return data;
};

export async function seed(knex: Knex): Promise<any> {
  const user = await getUserByEmail(knex, 'johnsmith@email.local');
  const pair = await getRecord(knex, 'pairs', { pairedBy: user.id });
  const sire = await getRecord(knex, 'dogs', { id: pair.sire });

  const measures = await insertMeasures(knex, sire.id, [
    '2015-01-01',
    '2016-01-01',
    '2017-01-01'
  ]);

  const data = merge(measures, [50, 80, 100]);

  return knex('heights').insert(data);
}
