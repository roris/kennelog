// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, JsonSchema, RelationMappings } from 'objection';
import { Application } from '../declarations';

class DogsLitters extends Model {
  createdAt!: string;

  updatedAt!: string;

  static get tableName() {
    return 'dogs_litters';
  }

  static get jsonSchema(): JsonSchema {
    return {
      type: 'object',
      required: ['dog', 'litter'],

      properties: {
        dogId: { type: 'integer' },
        litterId: { type: 'integer' }
      }
    };
  }

  static get relationMappings(): RelationMappings {
    const Litters = require('./litters.model')();
    const Dogs = require('./dogs.model')();

    return {
      litter: {
        relation: Model.BelongsToOneRelation,
        modelClass: Litters,
        join: {
          from: 'dogs_litters.litterId',
          to: 'dogs.id'
        }
      },

      dog: {
        relation: Model.BelongsToOneRelation,
        modelClass: Dogs,
        join: {
          from: 'dogs_litters.dogId',
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

module.exports = function(app?: Application) {
  return DogsLitters;
};
