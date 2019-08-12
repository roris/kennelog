import feathers, { Application } from '@feathersjs/feathers';
import sanitizeDog from '../../src/hooks/sanitize-dog';

describe("'sanitize-dog' hook", () => {
  let app: Application;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async create(data) {
        return data;
      }
    });

    app.service('dummy').hooks({
      before: {
        create: sanitizeDog()
      }
    });
  });

  it('Throws on empty data', async () => {
    expect.assertions(1);
    try {
      await app.service('dummy').create({});
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
