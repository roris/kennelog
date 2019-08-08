// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, JsonSchema, RelationMappings } from 'objection';
import { Application } from '../declarations';

class Measures extends Model {
  createdAt!: string;

  updatedAt!: string;

  static get tableName() {
    return 'measures';
  }

  static get jsonSchema(): JsonSchema {
    return {
      type: 'object',
      required: ['measuredOn', 'dog'],

      properties: {
        measuredOn: { type: 'string' },
        dog: { type: 'integer' }
      }
    };
  }

  static get relationMappings(): RelationMappings {
    const Dogs = require('./dogs.model')();
    return {
      dog: {
        relation: Model.BelongsToOneRelation,
        modelClass: Dogs,
        join: {
          from: 'dogs.id',
          to: 'measures.dog'
        }
      }
    };
  }

  $beforeInsert() {
    this.createdAt = this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}

export default function(app: Application) {
  return Measures;
}
