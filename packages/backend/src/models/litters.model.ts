// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, JsonSchema, RelationMappings } from 'objection';
import { Application } from '../declarations';

class Litters extends Model {
  createdAt!: string;

  updatedAt!: string;

  static get tableName() {
    return 'litters';
  }

  static get jsonSchema(): JsonSchema {
    return {
      type: 'object',

      properties: {
        pairId: { type: ['integer', 'null'] }
      }
    };
  }

  static get relationMappings(): RelationMappings {
    const Pairs = require('./pairs.model')();

    return {
      pair: {
        relation: Model.BelongsToOneRelation,
        modelClass: Pairs,
        join: {
          from: 'litters.pairId',
          to: 'pairs.id'
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

module.exports = function(app?: Application) {
  return Litters;
};
