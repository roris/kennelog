import { Hook, HookContext } from '@feathersjs/feathers';

const populateBreed_ = async (dog, app) => {
  if (dog.breedId) {
    dog.breed = await app.service('breeds').get(dog.breedId);
  }

  return dog;
};

export const populateBreed = (options = {}): Hook => {
  return async (context: HookContext) => {
    const { app, method, result } = context;
    const dogs = method === 'find' ? result.data : [result];

    await Promise.all(dogs.map(async dog => populateBreed_(dog, app)));

    return context;
  };
};
