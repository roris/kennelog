import app from '../../src/app';

describe('\'pairs\' service', () => {
  it('registered the service', () => {
    const service = app.service('pairs');
    expect(service).toBeTruthy();
  });
});
