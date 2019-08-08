// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, RelationMappings, JsonSchema } from 'objection';
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
        parents: { type: ['integer', 'null'] }
      }
    };
  }

  static get relationMappings(): RelationMappings {
    const Pairs = require('./pairs.model')();

    return {
      parents: {
        relation: Model.BelongsToOneRelation,
        modelClass: Pairs,
        join: {
          from: 'pairs.id',
          to: 'litters.parents'
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
  return Litters;
}
