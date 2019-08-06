// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, JsonSchema, RelationMappings } from 'objection';
import Knex from 'knex';
import { Application } from '../declarations';

class dogs extends Model {
  createdAt!: string;

  updatedAt!: string;

  microchipNo!: number;

  gender!: string;

  dateOfBirth!: string;

  name!: string;

  owner!: number;

  breeder!: number;

  static get tableName() {
    return 'dogs';
  }

  static get jsonSchema() : JsonSchema {
    return {
      type: 'object',
      required: ['gender'],

      properties: {
        name: {type: ['string', 'null']},
        gender: { type: 'string' },
        microchipNo: {type: ['integer', 'null'] },
        dateOfBirth: {type: ['string', 'null']},
        owner: { type: ['integer', 'null']},
        breeder: {type: ['integer', 'null']}
      }
    };
  }

  static get relationMappings() : RelationMappings {
    const Users = require('./users.model');

    return {
      owner: {
        relation: Model.BelongsToOneRelation,
        modelClass: Users,
        join: {
          from: 'users.id',
          to: 'dogs.id'
        }
      },
      breeder: {
        relation: Model.BelongsToOneRelation,
        modelClass: Users,
        join: {
          from: 'users.id',
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

export default function (app: Application) {
  return dogs;
}
