// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';

const sanitizeGender = (gender: string) => {
  if (gender == '') {
    throw new Error('gender is required');
  }

  gender = gender.toUpperCase();

  if (gender !== 'M' && gender !== 'F') {
    throw new Error('Invalid gender');
  }

  return gender;
};

export default (options = {}): Hook => {
  return async (context: HookContext) => {
    const data: any = {};

    // gender is the only required property
    data.gender = sanitizeGender(context.data.gender);

    if (context.data.name != '') {
      data.name = context.data.name;
    }

    if (context.data.microchipNo != '') {
      data.microchipNo = context.data.microchipNo;
    }

    if (context.data.dateOfBirth != '') {
      data.dateOfBirth = context.data.dateOfBirth;
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
