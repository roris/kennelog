import app from '../../src/app';

describe('\'litters\' service', () => {
  it('registered the service', () => {
    const service = app.service('litters');
    expect(service).toBeTruthy();
  });
});
