// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, JsonSchema, RelationMappings } from 'objection';
import Knex from 'knex';
import { Application } from '../declarations';

class Heights extends Model {
  static get tableName() {
    return 'heights';
  }

  static get jsonSchema(): JsonSchema {
    return {
      type: 'object',
      required: ['height'],

      properties: {
        height: { type: 'number' }
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
          to: 'heights.id'
        }
      }
    };
  }
}

export default function (app: Application) {
  return Heights;
}
