// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, JsonSchema, RelationMappings } from 'objection';
import Knex from 'knex';
import { Application } from '../declarations';

class Breeds extends Model {
  createdAt!: string;

  updatedAt!: string;

  name!: string;

  static get tableName() {
    return 'breeds';
  }

  static get jsonSchema(): JsonSchema {
    return {
      type: 'object',
      required: ['name'],

      properties: {
        name: { type: 'string' }
      }
    };
  }

  static get relationMappings(): RelationMappings {
    const Dogs = require('./dogs.model')();

    return {
      dogs: {
        relation: Model.HasManyRelation,
        modelClass: Dogs,
        join: {
          from: 'breeds.id',
          to: 'dogs.breed'
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
  return Breeds;
}
