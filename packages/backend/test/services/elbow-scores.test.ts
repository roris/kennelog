import app from '../../src/app';

describe('\'elbow-scores\' service', () => {
  it('registered the service', () => {
    const service = app.service('elbow-scores');
    expect(service).toBeTruthy();
  });
});
