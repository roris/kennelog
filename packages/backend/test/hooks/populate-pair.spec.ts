import feathers, { Application } from '@feathersjs/feathers';
import { populatePair } from '../../src/hooks/populate-pair';

const pair = { nothing: 'nothing to see here' };

describe("'populate-pair' Hook", () => {
  let app: Application;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async create(data) {
        return data;
      }
    });

    app.use('/pairs', {
      async get(data) {
        return pair;
      }
    });

    app.service('/dummy').hooks({
      after: populatePair()
    });
  });

  it('populates object with its `pair`', async () => {
    expect.assertions(1);
    const data = await app.service('dummy').create({ pairId: 1 });
    expect(data.pair).toBe(pair);
  });

  it('ignores objects that does not have a `pairId`', async () => {
    expect.assertions(1);
    const data = await app.service('dummy').create({});
    expect(data.pair).toBeFalsy();
  });
});
