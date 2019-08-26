import * as Knex from 'knex';
import { insertMeasures, mergeIdAndData } from './util/common';
import { random } from 'lodash';

const sumHipScore = hipScore => {
  hipScore.totalScore = 0;
  hipScore.totalScore += hipScore.norbergAngleLeft;
  hipScore.totalScore += hipScore.norbergAngleRight;
  hipScore.totalScore += hipScore.subluxationLeft;
  hipScore.totalScore += hipScore.subluxationRight;
  hipScore.totalScore += hipScore.cranialAcetabularEdgeLeft;
  hipScore.totalScore += hipScore.cranialAcetabularEdgeRight;
  hipScore.totalScore += hipScore.dorsalAcetabularEdgeLeft;
  hipScore.totalScore += hipScore.dorsalAcetabularEdgeRight;
  hipScore.totalScore += hipScore.acetabularFossaLeft;
  hipScore.totalScore += hipScore.acetabularFossaRight;
  hipScore.totalScore += hipScore.caudalAcetabularEdgeLeft;
  hipScore.totalScore += hipScore.caudalAcetabularEdgeRight;
  hipScore.totalScore += hipScore.femoralHeadNeckExostosisLeft;
  hipScore.totalScore += hipScore.femoralHeadNeckExostosisRight;
  hipScore.totalScore += hipScore.femoralHeadRecontouringLeft;
  hipScore.totalScore += hipScore.femoralHeadRecontouringRight;
  return hipScore;
};

const generateHipScores = amount => {
  return Array(amount)
    .fill({})
    .map(hipScore => {
      return {
        norbergAngleLeft: random(0, 6),
        norbergAngleRight: random(0, 6),
        // subluxation
        subluxationLeft: random(0, 6),
        subluxationRight: random(0, 6),
        // cranial acetabular edge
        cranialAcetabularEdgeLeft: random(0, 6),
        cranialAcetabularEdgeRight: random(0, 6),
        // dorsal acetabular edge
        dorsalAcetabularEdgeLeft: random(0, 6),
        dorsalAcetabularEdgeRight: random(0, 6),
        // cranial effective acetabular rim
        cranialEffectiveAcetabularRimLeft: random(0, 6),
        cranialEffectiveAcetabularRimRight: random(0, 6),
        // acetabular fossa
        acetabularFossaLeft: random(0, 6),
        acetabularFossaRight: random(0, 6),
        // caudal acetabular edge
        caudalAcetabularEdgeLeft: random(0, 6),
        caudalAcetabularEdgeRight: random(0, 6),
        // femoral head/neck exostosis
        femoralHeadNeckExostosisLeft: random(0, 6),
        femoralHeadNeckExostosisRight: random(0, 6),
        // femoral head recontouring
        femoralHeadRecontouringLeft: random(0, 6),
        femoralHeadRecontouringRight: random(0, 6)
      };
    })
    .map(hipScore => sumHipScore(hipScore));
};

export async function seed(knex: Knex): Promise<any> {
  const measures = await insertMeasures(knex);
  const hipScores = generateHipScores(measures.length);
  const data = mergeIdAndData(measures, hipScores);

  return knex('hip_scores').insert(data);
}
