// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, RelationMappings, JsonSchema } from 'objection';
import { Application } from '../declarations';

class HipScores extends Model {
  static get tableName() {
    return 'hip_scores';
  }

  static get jsonSchema(): JsonSchema {
    return {
      type: 'object',
      required: [
        'na_l',
        'na_r',
        's_l',
        's_r',
        'crae_l',
        'crae_r',
        'dae_l',
        'dae_r',
        'craer_l',
        'craer_r',
        'af_l',
        'af_r',
        'cdae_l',
        'cdae_r',
        'fhne_l',
        'fhne_r',
        'fhrc_l',
        'fhrc_r'
      ],

      properties: {
        na_l: { type: 'integer' },
        na_r: { type: 'integer' },
        s_l: { type: 'integer' },
        s_r: { type: 'integer' },
        crae_l: { type: 'integer' },
        crae_r: { type: 'integer' },
        dae_l: { type: 'integer' },
        dae_r: { type: 'integer' },
        craer_l: { type: 'integer' },
        craer_r: { type: 'integer' },
        af_l: { type: 'integer' },
        af_r: { type: 'integer' },
        cdae_l: { type: 'integer' },
        cdae_r: { type: 'integer' },
        fhne_l: { type: 'integer' },
        fhne_r: { type: 'integer' },
        fhrc_l: { type: 'integer' },
        fhrc_r: { type: 'integer' }
      }
    };
  }

  // static get relationMappings(): RelationMappings {
  //   const Measures = require('./measures.model')();

  //   return {
  //     parent: {
  //       relation: Model.BelongsToOneRelation,
  //       modelClass: Measures,
  //       join: {
  //         from: 'measures.id',
  //         to: 'hip_scores.id'
  //       }
  //     }
  //   };
  // }
}

export default function(app: Application) {
  return HipScores;
}
