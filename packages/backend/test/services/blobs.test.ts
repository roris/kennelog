import app from '../../src/app';

describe('\'blobs\' service', () => {
  it('registered the service', () => {
    const service = app.service('blobs');
    expect(service).toBeTruthy();
  });
});
