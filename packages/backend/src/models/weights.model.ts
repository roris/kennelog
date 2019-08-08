// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, JsonSchema, RelationMappings } from 'objection';
import { Application } from '../declarations';

class Weights extends Model {
  static get tableName() {
    return 'weights';
  }

  static get jsonSchema(): JsonSchema {
    return {
      type: 'object',
      required: ['weight'],

      properties: {
        weight: { type: 'number' }
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
  //         to: 'weights.id'
  //       }
  //     }
  //   };
  // }
}

export default function(app: Application) {
  return Weights;
}
