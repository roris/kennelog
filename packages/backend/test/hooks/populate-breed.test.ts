import feathers, { Application } from '@feathersjs/feathers';
import { populateBreed } from '../../src/hooks/populate-breed';
import { finished } from 'stream';

describe("'populate-breed' Hook", () => {
  let app: Application;
  const breed = { id: 1, name: 'totally a real dog breed' };

  beforeEach(() => {
    app = feathers();

    app.use('/breeds', {
      async get(data) {
        return breed;
      }
    });

    app.use('/dogs', {
      async create(data) {
        return data;
      }
    });

    app.service('dogs').hooks({
      after: populateBreed()
    });
  });

  it('populates a new dog with its `breed`', async () => {
    expect.assertions(1);
    const data = await app.service('dogs').create({ breed: 1 });
    expect(data.breed).toBe(breed);
  });

  it('does not populate breed when breedId is not given', async () => {
    expect.assertions(1);
    const data = await app.service('dogs').create({});
    expect(data.breed).toBeFalsy();
  });
});
