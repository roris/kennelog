import app from '../../src/app';

describe('\'dogs\' service', () => {
  it('registered the service', () => {
    const service = app.service('dogs');
    expect(service).toBeTruthy();
  });
});
