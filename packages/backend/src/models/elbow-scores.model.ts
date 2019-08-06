// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, RelationMappings } from 'objection';
import { Application } from '../declarations';

class ElbowScores extends Model {
  static get tableName() {
    return 'elbow_scores';
  }

  static get jsonSchema() {
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
    const Measures = require('./measures.model');

    return {
      parent: {
        relation: Model.BelongsToOneRelation,
        modelClass: Measures,
        join: {
          from: 'measures.id',
          to: 'elbow_scores.id'
        }
      }
    };
  }
}

export default function (app: Application) {
  return ElbowScores;
}
