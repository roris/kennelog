import feathers, { Application } from '@feathersjs/feathers';
import { populateChildren } from '../../src/hooks/populate-children';

const dogs = [{ name: 'nothing to see here' }];

describe("'populate-children' Hook", () => {
  let app: Application;

  beforeEach(() => {
    app = feathers();

    app.use('/litters', {
      async create(data) {
        return data;
      }
    });

    app.use('/dogs', {
      async find(data) {
        return { data: dogs };
      }
    });

    app.service('litters').hooks({
      after: populateChildren()
    });
  });

  it('populates a litter with its `children`', async () => {
    expect.assertions(1);
    const data = await app.service('litters').create({ id: 1 });
    expect(data.children).toBe(dogs);
  });
});
