import app from '../../src/app';

describe('\'hip-scores\' service', () => {
  it('registered the service', () => {
    const service = app.service('hip-scores');
    expect(service).toBeTruthy();
  });
});
