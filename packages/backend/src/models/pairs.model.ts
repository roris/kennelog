// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, RelationMappings, JsonSchema } from 'objection';
import { Application } from '../declarations';

class Pairs extends Model {
  createdAt!: string;

  updatedAt!: string;

  static get tableName() {
    return 'pairs';
  }

  static get jsonSchema(): JsonSchema {
    return {
      type: 'object',
      properties: {
        sire: { type: ['number', 'null'] },
        dame: { type: ['number', 'null'] },
        pairedBy: { type: ['number', 'null'] },
        pairedOn: { type: ['string', 'null'] }
      }
    };
  }

  static get relationMappings(): RelationMappings {
    const Dogs = require('./dogs.model');
    const Users = require('./users.model');

    return {
      sire: {
        relation: Model.BelongsToOneRelation,
        modelClass: Dogs,
        join: {
          from: 'dogs.id',
          to: 'pairs.sire'
        }
      },

      dame: {
        relation: Model.BelongsToOneRelation,
        modelClass: Dogs,
        join: {
          from: 'dogs.id',
          to: 'pairs.dame'
        }
      },

      breeder: {
        relation: Model.BelongsToOneRelation,
        modelClass: Users,
        join: {
          from: 'users.id',
          to: 'pairs.pairedBy'
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
  return Pairs;
}
