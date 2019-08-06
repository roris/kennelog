import app from '../../src/app';

describe('\'heights\' service', () => {
  it('registered the service', () => {
    const service = app.service('heights');
    expect(service).toBeTruthy();
  });
});
