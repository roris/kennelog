// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';

const sanitizeGender = (gender: string) => {
  if (!gender) {
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

    if (context.data.name) {
      data.name = context.data.name;
    }

    if (context.data.microchipNo) {
      data.microchipNo = context.data.microchipNo;
    }

    if (context.data.dateOfBirth) {
      data.dateOfBirth = context.data.dateOfBirth;
    }

    if (context.data.breedId) {
      data.breedId = context.data.breedId;
    }

    if (context.data.pictureId) {
      data.pictureId = context.data.pictureId;
    }

    if (context.data.breederId) {
      data.breederId = context.data.breederId;
    }

    if (context.data.ownerId) {
      data.ownerId = context.data.ownerId;
    }

    context.data = data;

    return context;
  };
};
