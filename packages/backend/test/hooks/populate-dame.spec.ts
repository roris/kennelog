import feathers, { Application } from '@feathersjs/feathers';
import { populateDame } from '../../src/hooks/populate-dame';

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
      after: populateDame()
    });
  });

  it('populates a new dog with its `dame`', async () => {
    expect.assertions(1);
    const data = await app.service('pairs').create({ dameId: 1 });
    expect(data.dame).toBe(dog);
  });

  it('ignores objects that do not have a `dameId`', async () => {
    expect.assertions(1);
    const data = await app.service('pairs').create({});
    expect(data.dame).toBeFalsy();
  });
});
