// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, RelationMappings } from 'objection';
import { Application } from '../declarations';

class Lengths extends Model {
  static get tableName() {
    return 'lengths';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['length'],

      properties: {
        length: { type: 'number' }
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
  //         to: 'lengths.id'
  //       }
  //     }
  //   };
  // }
}

export default function(app: Application) {
  return Lengths;
}
