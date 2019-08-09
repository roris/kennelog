import feathers, { Application } from '@feathersjs/feathers';
import gravatar from '../../src/hooks/gravatar';

describe("'gravatar' hook", () => {
  let app: Application;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async create(data) {
        return data;
      }
    });

    app.service('dummy').hooks({
      before: gravatar()
    });
  });

  it("creates a gravatar link from the user' email address", async () => {
    expect.assertions(1);
    const email = 'test@example.com';
    const result = await app.service('dummy').create({ email: email });
    expect(result).toEqual({
      email: email,
      avatar: 'https://s.gravatar.com/avatar/55502f40dc8b7c769880b10874abc9d0'
    });
  });
});
