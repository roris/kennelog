import app from '../../src/app';

describe('\'lengths\' service', () => {
  it('registered the service', () => {
    const service = app.service('lengths');
    expect(service).toBeTruthy();
  });
});
