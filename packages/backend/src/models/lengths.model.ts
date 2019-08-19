// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, JsonSchema, RelationMappings } from 'objection';
import { Application } from '../declarations';

class Lengths extends Model {
  static get tableName() {
    return 'lengths';
  }

  static get jsonSchema(): JsonSchema {
    return {
      type: 'object',
      required: ['length'],

      properties: {
        length: { type: 'number' }
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
          from: 'lengths.id',
          to: 'measures.id'
        }
      }
    };
  }
}

module.exports = function(app?: Application) {
  return Lengths;
};
