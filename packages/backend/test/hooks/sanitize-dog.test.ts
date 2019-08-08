import feathers, { Application } from '@feathersjs/feathers';
import sanitizeDog from '../../src/hooks/sanitize-dog';

describe("'sanitize-dog' hook", () => {
  let app: Application;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async get(id: any) {
        return { id };
      }
    });

    app.service('dummy').hooks({
      before: sanitizeDog()
    });
  });

  it('runs the hook', async () => {
    expect.assertions(1);
    const result = await app.service('dummy').get('test');
    expect(result).toEqual({ id: 'test' });
  });
});
