// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, JsonSchema } from 'objection';
import Knex from 'knex';
import { Application } from '../declarations';

class dogs extends Model {
  createdAt!: string;
  updatedAt!: string;
  microchipNo!: number;
  gender!: string;
  dateOfBirth!: string;
  name!: string;

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
