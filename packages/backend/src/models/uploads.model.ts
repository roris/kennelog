// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, RelationMappings } from 'objection';
import { Application } from '../declarations';

class Uploads extends Model {
  createdAt!: string;

  updatedAt!: string;

  path!: string;

  static get tableName() {
    return 'uploads';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['path'],

      properties: {
        path: { type: 'string' }
      }
    };
  }

  static get relationMappings(): RelationMappings {
    const Dog = require('./dogs.model');

    return {
      dog: {
        relation: Model.HasOneRelation,
        modelClass: Dog,
        join: {
          from: 'uploads.id',
          to: 'dogs.picture'
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
  return Uploads;
}
