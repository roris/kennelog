// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, JSONSchema, RelationMappings } from 'objection';
import { Application } from '../declarations';

class HipScores extends Model {
  static get tableName() {
    return 'hip_scores';
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: [
        'norbergAngleLeft',
        'norbergAngleRight',
        'subluxationLeft',
        'subluxationRight',
        'cranialAcetabularEdgeLeft',
        'cranialAcetabularEdgeRight',
        'dorsalAcetabularEdgeLeft',
        'dorsalAcetabularEdgeRight',
        'cranialEffectiveAcetabularRimLeft',
        'cranialEffectiveAcetabularRimRight',
        'acetabularFossaLeft',
        'acetabularFossaRight',
        'caudalAcetabularEdgeLeft',
        'caudalAcetabularEdgeRight',
        'femoralHeadNeckExostosisLeft',
        'femoralHeadNeckExostosisRight',
        'femoralHeadRecontouringLeft',
        'femoralHeadRecontouringRight',
        'totalScore'
      ],
      properties: {
        norbergAngleLeft: { type: ['integer'] },
        norbergAngleRight: { type: ['integer'] },
        subluxationLeft: { type: ['integer'] },
        subluxationRight: { type: ['integer'] },
        cranialAcetabularEdgeLeft: { type: ['integer'] },
        cranialAcetabularEdgeRight: { type: ['integer'] },
        dorsalAcetabularEdgeLeft: { type: ['integer'] },
        dorsalAcetabularEdgeRight: { type: ['integer'] },
        cranialEffectiveAcetabularRimLeft: { type: ['integer'] },
        cranialEffectiveAcetabularRimRight: { type: ['integer'] },
        acetabularFossaLeft: { type: ['integer'] },
        acetabularFossaRight: { type: ['integer'] },
        caudalAcetabularEdgeLeft: { type: ['integer'] },
        caudalAcetabularEdgeRight: { type: ['integer'] },
        femoralHeadNeckExostosisLeft: { type: ['integer'] },
        femoralHeadNeckExostosisRight: { type: ['integer'] },
        femoralHeadRecontouringLeft: { type: ['integer'] },
        femoralHeadRecontouringRight: { type: ['integer'] },
        totalScore: { type: ['integer'] }
      }
    };
  }

  static get relationMappings(): RelationMappings {
    const Measures = require('./measures.model')();

    return {
      measure: {
        relation: Model.BelongsToOneRelation,
        modelClass: Measures,
        join: {
          from: 'hip_scores.id',
          to: 'measures.id'
        }
      }
    };
  }
}

export function createModel(app?: Application) {
  return HipScores;
}
