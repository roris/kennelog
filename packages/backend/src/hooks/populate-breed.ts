import { Hook, HookContext } from '@feathersjs/feathers';
import titleCase from 'title-case';

const populateBreed_ = async (dog, app) => {
  if (dog.breedId) {
    dog.breed = await app.service('breeds').get(dog.breedId);
    dog.breed.name = titleCase(dog.breed.name);
  }

  return dog;
};

export const populateBreed = (options = {}): Hook => {
  return async (context: HookContext) => {
    const { app, method, result, params } = context;
    const dogs = method === 'find' ? result.data : [result];

    await Promise.all(dogs.map(async dog => populateBreed_(dog, app)));

    return context;
  };
};
