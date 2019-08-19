import feathers, { Application } from '@feathersjs/feathers';
import { populateSire } from '../../src/hooks/populate-sire';

const dog = { name: 'nothing to see here' };

describe("'populate-sire' Hook", () => {
  let app: Application;

  beforeEach(() => {
    app = feathers();

    app.use('/pairs', {
      async create(data) {
        return data;
      }
    });

    app.use('/dogs', {
      async get(data) {
        return dog;
      }
    });

    app.service('pairs').hooks({
      after: populateSire()
    });
  });

  it('populates a new dog with its `sire`', async () => {
    expect.assertions(1);
    const data = await app.service('pairs').create({ sireId: 1 });
    expect(data.sire).toBe(dog);
  });

  it('ignores objects that do not have a `sireId`', async () => {
    expect.assertions(1);
    const data = await app.service('pairs').create({});
    expect(data.sire).toBeFalsy();
  });
});
