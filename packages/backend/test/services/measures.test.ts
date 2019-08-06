import app from '../../src/app';

describe('\'measures\' service', () => {
  it('registered the service', () => {
    const service = app.service('measures');
    expect(service).toBeTruthy();
  });
});
