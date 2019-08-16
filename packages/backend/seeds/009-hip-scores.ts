import * as Knex from 'knex';
import { getUserByEmail, getRecord, insertMeasures } from './util/common';
import { random } from 'lodash';

const generateHipScores = amount => {
  return Array(amount)
    .fill({})
    .map(hipScore => {
      return {
        na_l: random(0, 6),
        na_r: random(0, 6),
        // subluxation
        s_l: random(0, 6),
        s_r: random(0, 6),
        // cranial acetabular edge
        crae_l: random(0, 6),
        crae_r: random(0, 6),
        // dorsal acetabular edge
        dae_l: random(0, 6),
        dae_r: random(0, 6),
        // cranial effective acetabular rim
        craer_l: random(0, 6),
        craer_r: random(0, 6),
        // acetabular fossa
        af_l: random(0, 6),
        af_r: random(0, 6),
        // caudal acetabular edge
        cdae_l: random(0, 6),
        cdae_r: random(0, 6),
        // femoral head/neck exostosis
        fhne_l: random(0, 6),
        fhne_r: random(0, 6),
        // femoral head recontouring
        fhrc_l: random(0, 6),
        fhrc_r: random(0, 6)
      };
    });
};

const mergeMeasuresAndHipScores = (measures: any[], hipScores: any[]) => {
  const shorter = measures.length < hipScores.length ? measures : hipScores;
  const data = new Array(shorter.length);

  // merge the arrays
  for (let i = 0; i < data.length; ++i) {
    data[i] = {
      id: measures[i],
      ...hipScores[i]
    };
  }

  return data;
};

export async function seed(knex: Knex): Promise<any> {
  const user = await getUserByEmail(knex, 'johnsmith@email.local');
  const pair = await getRecord(knex, 'pairs', { pairedBy: user.id });
  const sire = await getRecord(knex, 'dogs', { id: pair.sire });
  const dates = ['2015-01-01', '2016-01-01', '2017-01-01'];
  const measures = await insertMeasures(knex, sire.id, dates);
  const hipScores = generateHipScores(dates.length);
  const data = mergeMeasuresAndHipScores(measures, hipScores);

  return knex('hip_scores').insert(data);
}
