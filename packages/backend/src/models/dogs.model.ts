// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, JSONSchema, RelationMappings } from 'objection';
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

  static get jsonSchema(): JSONSchema {
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

  static get relationMappings(): RelationMappings {
    const Users = require('./users.model')();
    const Breeds = require('./breeds.model')();
    const Events = require('./events.model')();
    const DogsLitters = require('./dogs-litters.model')();

    return {
      owner: {
        relation: Model.BelongsToOneRelation,
        modelClass: Users,
        join: {
          from: 'dogs.ownerId',
          to: 'users.id'
        }
      },
      breeder: {
        relation: Model.BelongsToOneRelation,
        modelClass: Users,
        join: {
          from: 'dogs.breederId',
          to: 'users.id'
        }
      },
      breed: {
        relation: Model.BelongsToOneRelation,
        modelClass: Breeds,
        join: {
          from: 'dogs.breedId',
          to: 'breeds.id'
        }
      },
      events: {
        relation: Model.HasManyRelation,
        modelClass: Events,
        join: {
          from: 'dogs.id',
          to: 'events.dogId'
        }
      },
      litter: {
        relation: Model.BelongsToOneRelation,
        modelClass: DogsLitters,
        join: {
          from: 'dogs.id',
          to: 'dogs_litters.dogId'
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
  return Dogs;
}
