// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';

export default (options = {}): Hook => {
  return async (context: HookContext) => {
    const data: any = {};

    // gender is the only required property
    if (context.data.gender === undefined) {
      throw new Error('gender is required');
    }

    data.gender = context.data.gender;

    if (context.data.name !== undefined) {
      data.name = context.data.name;
    }

    if (context.data.microchipNo !== undefined) {
      data.microchipNo = context.data.microchipNo;
    }

    if (context.data.dateOfBirth !== undefined) {
      data.dateOfBirth = context.data.dateOfBirth;
    }

    if (context.data.sire) {
      data.sire = context.data.sire;
    }

    if (context.data.dame) {
      data.dame = context.data.dame;
    }

    if (context.data.breed) {
      data.breed = context.data.breed;
    }

    if (context.data.picture) {
      data.picture = context.data.picture;
    }

    if (context.data.breeder) {
      data.breeder = context.data.breeder;
    }

    if (context.data.owner) {
      data.owner = context.data.owner;
    }

    context.data = data;

    return context;
  };
};
