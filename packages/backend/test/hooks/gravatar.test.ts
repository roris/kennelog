import feathers, { Application} from '@feathersjs/feathers';
import gravatar from '../../src/hooks/gravatar';

describe('\'gravatar\' hook', () => {
  let app: Application;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async get(id: any) {
        return { id };
      }
    });

    app.service('dummy').hooks({
      before: gravatar()
    });
  });

  it('runs the hook', async () => {
    expect.assertions(1);
    const result = await app.service('dummy').get('test');
    expect(result).toEqual({ id: 'test' });
  });
});
