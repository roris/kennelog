import feathers, { Application } from '@feathersjs/feathers';
import sanitizeDog from '../../src/hooks/sanitize-dog';

const params = {
  gender: 'M',
  name: 'Doge',
  microchipNo: '123456789012345',
  dateOfBirth: '2018-01-01',
  breedId: 1,
  pictureId: 2,
  breederId: 1,
  ownerId: 1
};

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

  it('throws when no gender is given', async () => {
    expect.assertions(1);
    try {
      await app.service('dummy').create({});
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("throws when gender is neither 'M' nor 'F'", async () => {
    expect.assertions(1);

    try {
      await app.service('dummy').create({ gender: 'A' });
    } catch (error) {
      expect(error.message).toBe('Invalid gender');
    }
  });

  it('accepts requests which specify gender only', async () => {
    expect.assertions(1);
    const params = { gender: 'F' };

    const result = await app.service('dummy').create(params);
    expect(result).toEqual(params);
  });

  it('strips extra properties', async () => {
    expect.assertions(1);
    const withExtras = { ...params, extra: true, stripMe: false };

    const result = await app.service('dummy').create(withExtras);
    expect(result).toEqual(params);
  });
});
