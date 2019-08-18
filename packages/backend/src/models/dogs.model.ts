// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, JsonSchema } from 'objection';
import { Application } from '../declarations';

class Dogs extends Model {
  createdAt!: string;

  updatedAt!: string;

  microchipNo!: string;

  gender!: string;

  dateOfBirth!: string;

  name!: string;

  ownerId!: number;

  breederId!: number;

  breedId!: number;

  pictureId!: number;

  static get tableName() {
    return 'dogs';
  }

  static get jsonSchema(): JsonSchema {
    return {
      type: 'object',
      required: ['gender'],

      properties: {
        name: { type: ['string', 'null'] },
        gender: { type: 'string' },
        microchipNo: { type: ['string', 'null'] },
        dateOfBirth: { type: ['string', 'null'] },
        ownerId: { type: ['integer', 'null'] },
        breederId: { type: ['integer', 'null'] },
        breedId: { type: ['integer', 'null'] },
        pictureId: { type: ['integer', 'null'] }
      }
    };
  }

  // static get relationMappings(): RelationMappings {
  //   const Users = require('./users.model')();

  //   return {
  //     owner: {
  //       relation: Model.BelongsToOneRelation,
  //       modelClass: Users(),
  //       join: {
  //         from: 'users.id',
  //         to: 'dogs.id'
  //       }
  //     },
  //     breeder: {
  //       relation: Model.BelongsToOneRelation,
  //       modelClass: Users(),
  //       join: {
  //         from: 'users.id',
  //         to: 'dogs.id'
  //       }
  //     }
  //   };
  // }

  $beforeInsert() {
    this.createdAt = this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}

export default function(app: Application) {
  return Dogs;
}
