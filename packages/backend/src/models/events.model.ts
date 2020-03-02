// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, JSONSchema, RelationMappings } from 'objection';
import { Application } from '../declarations';

class Events extends Model {
  createdAt!: string;

  updatedAt!: string;

  static get tableName() {
    return 'events';
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: ['eventDate', 'eventType', 'dog'],

      properties: {
        eventDate: { type: 'string' },
        eventType: { type: 'string' },
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
          from: 'events.id',
          to: 'dogs.id'
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

export function createModel(app?: Application) {
  return Events;
}
