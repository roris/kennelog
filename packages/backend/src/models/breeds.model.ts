// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, JSONSchema, RelationMappings } from 'objection';
import { Application } from '../declarations';

class Breeds extends Model {
  createdAt!: string;

  updatedAt!: string;

  name!: string;

  static get tableName() {
    return 'breeds';
  }

  static get jsonSchema(): JSONSchema {
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
          to: 'dogs.breedId'
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
  return Breeds;
}
