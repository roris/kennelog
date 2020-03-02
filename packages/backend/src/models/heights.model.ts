// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, JSONSchema, RelationMappings } from 'objection';
import { Application } from '../declarations';

class Heights extends Model {
  static get tableName() {
    return 'heights';
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: ['height'],

      properties: {
        height: { type: 'number' }
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
          from: 'heights.id',
          to: 'measures.id'
        }
      }
    };
  }
}

export function createModel(app?: Application) {
  return Heights;
}
