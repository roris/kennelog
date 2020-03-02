// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, JSONSchema, RelationMappings } from 'objection';
import { Application } from '../declarations';

class Pairs extends Model {
  createdAt!: string;

  updatedAt!: string;

  static get tableName() {
    return 'pairs';
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      properties: {
        sireId: { type: ['number', 'null'] },
        dameId: { type: ['number', 'null'] },
        pairedBy: { type: ['number', 'null'] },
        pairedOn: { type: ['string', 'null'] }
      }
    };
  }

  static get relationMappings(): RelationMappings {
    const Dogs = require('./dogs.model')();
    const Litters = require('./litters.model')();
    const Users = require('./users.model')();

    return {
      sire: {
        relation: Model.BelongsToOneRelation,
        modelClass: Dogs,
        join: {
          from: 'pairs.sireId',
          to: 'dogs.id'
        }
      },
      litters: {
        relation: Model.HasOneRelation,
        modelClass: Litters,
        join: {
          from: 'pairs.id',
          to: 'litters.pairId'
        }
      },
      dame: {
        relation: Model.BelongsToOneRelation,
        modelClass: Dogs,
        join: {
          from: 'pairs.dameId',
          to: 'dogs.id'
        }
      },
      pairer: {
        relation: Model.BelongsToOneRelation,
        modelClass: Users,
        join: {
          from: 'pairs.pairedBy',
          to: 'users.id'
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
  return Pairs;
}
