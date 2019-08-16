import * as Knex from 'knex';
import { getUserByEmail, getRecord, insertMeasures } from './util/common';
import { random } from 'lodash';

const merge = (measures: any[], weightScores: any[]) => {
  const shorter =
    measures.length < weightScores.length ? measures : weightScores;
  const data = new Array(shorter.length);

  // merge the arrays
  for (let i = 0; i < data.length; ++i) {
    data[i] = {
      id: measures[i],
      ...weightScores[i]
    };
  }

  return data;
};

const generateWeights = (amount: number) => {
  return Array(amount)
    .fill({})
    .map(weight => {
      return {
        weight: random(20, 100)
      };
    });
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

  const data = merge(measures, generateWeights(measures.length));

  return knex('weights').insert(data);
}
