import app from '../../src/app';

describe('\'breeds\' service', () => {
  it('registered the service', () => {
    const service = app.service('breeds');
    expect(service).toBeTruthy();
  });
});
