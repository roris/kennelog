import feathers, { Application } from '@feathersjs/feathers';
import { nameToTitleCase } from '../../src/hooks/name-to-title-case';

describe("'name-to-title-case' hook", () => {
  let app: Application;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async create(data) {
        return data;
      }
    });

    app.service('dummy').hooks({
      after: nameToTitleCase()
    });
  });

  it('converts name to title case', async () => {
    expect.assertions(1);
    const name = 'What a name!';
    const result = await app.service('dummy').create({ name: name });
    expect(result.name).toBe('What A Name!');
  });

  it('ignores objects without names', async () => {
    expect.assertions(1);
    const result = await app.service('dummy').create({});
    expect(result.name).toBeUndefined();
  });
});
