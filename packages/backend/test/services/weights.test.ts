import app from '../../src/app';

describe('\'weights\' service', () => {
  it('registered the service', () => {
    const service = app.service('weights');
    expect(service).toBeTruthy();
  });
});
