import * as Knex from 'knex';
import { insertMeasures, mergeIdAndData } from './util/common';
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

export async function seed(knex: Knex): Promise<any> {
  const measures = await insertMeasures(knex);
  const hipScores = generateHipScores(measures.length);
  const data = mergeIdAndData(measures, hipScores);

  return knex('hip_scores').insert(data);
}
