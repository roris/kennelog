import app from '../../src/app';

describe("'events' service", () => {
  it('registered the service', () => {
    const service = app.service('events');
    expect(service).toBeTruthy();
  });
});
