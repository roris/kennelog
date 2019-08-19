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
      required: ['dogId', 'litterId'],

      properties: {
        dogId: { type: 'integer' },
        litterId: { type: 'integer' }
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
