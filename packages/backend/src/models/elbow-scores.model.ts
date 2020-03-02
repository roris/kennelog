// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, JSONSchema, RelationMappings } from 'objection';
import { Application } from '../declarations';

class ElbowScores extends Model {
  static get tableName() {
    return 'elbow_scores';
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: ['right', 'left'],

      properties: {
        right: { type: 'integer' },
        left: { type: 'integer' }
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
          from: 'elbow_scores.id',
          to: 'measures.id'
        }
      }
    };
  }
}

export function createModel(app?: Application) {
  return ElbowScores;
}
