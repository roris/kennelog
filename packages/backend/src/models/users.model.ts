// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, JsonSchema, RelationMappings } from 'objection';
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

  static get jsonSchema(): JsonSchema {
    return {
      type: 'object',
      required: ['password'],

      properties: {
        licenseNo: {type: ['string']},
        email: {type: ['string', 'null']},
        password: {type: 'string'},
        name: {type: ['string', 'null']},
        dateOfBirth: {type: ['string', 'null']},
        avatar: {type: ['string', 'null']}
      }
    };
  }

  static get relationMappings() : RelationMappings {
    const Dogs = require('./dogs.model');

    return {
      stock: {
        relation: Model.HasManyRelation,
        modelClass: Dogs,
        join: {
          from: 'users.id',
          to: 'dogs.owner'
        }
      },

      bred: {
        relation: Model.HasManyRelation,
        modelClass: Dogs,
        join: {
          from: 'users.id',
          to: 'dogs.breeder'
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

export default function (app: Application): any {
  return Users;
}
