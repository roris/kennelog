// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, JSONSchema, RelationMappings } from 'objection';
import { Application } from '../declarations';

class Weights extends Model {
  static get tableName() {
    return 'weights';
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: ['weight'],

      properties: {
        weight: { type: 'number' }
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
          from: 'weights.id',
          to: 'measures.id'
        }
      }
    };
  }
}

export function createModel(app?: Application) {
  return Weights;
}
