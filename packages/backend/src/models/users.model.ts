// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, JSONSchema, RelationMappings } from 'objection';
import { Application } from '../declarations';

class Users extends Model {
  createdAt!: string;

  updatedAt!: string;

  licenseNo!: string;

  email!: string;

  password!: string;

  name!: string;

  dateOfBirth!: string;

  avatar!: string;

  static get tableName(): string {
    return 'users';
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: ['password'],

      properties: {
        licenseNo: { type: ['string'] },
        email: { type: ['string', 'null'] },
        password: { type: 'string' },
        name: { type: ['string', 'null'] },
        dateOfBirth: { type: ['string', 'null'] },
        avatar: { type: ['string', 'null'] }
      }
    };
  }

  static get relationMappings(): RelationMappings {
    const Dogs = require('./dogs.model')();
    const Pairs = require('./pairs.model')();

    return {
      ownDogs: {
        relation: Model.HasManyRelation,
        modelClass: Dogs,
        join: {
          from: 'users.id',
          to: 'dogs.ownerId'
        }
      },

      bredDogs: {
        relation: Model.HasManyRelation,
        modelClass: Dogs,
        join: {
          from: 'users.id',
          to: 'dogs.breederId'
        }
      },

      pairs: {
        relation: Model.HasManyRelation,
        modelClass: Pairs,
        join: {
          from: 'users.id',
          to: 'pairs.pairedBy'
        }
      }
    };
  }

  $beforeInsert(): void {
    this.createdAt = this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate(): void {
    this.updatedAt = new Date().toISOString();
  }
}

export function createModel(app?: Application) {
  return Users;
}
