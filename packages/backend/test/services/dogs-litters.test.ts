import app from '../../src/app';

describe('\'dogs-litters\' service', () => {
  it('registered the service', () => {
    const service = app.service('dogs-litters');
    expect(service).toBeTruthy();
  });
});
