import { NewPair } from '../../../src/components/new-pair/new-pair';

class ServiceStub {
  async find(params) {
    return { data: [{ measure: { dog: { id: 42 } }, id: 42 }] };
  }

  async create(data) {
    return data;
  }
}

class ApiStub {
  service(serviceName) {
    return new ServiceStub();
  }
}

class StateStub {
  authenticated = false;
  user = {
    id: 42
  };
}

describe('New Pair Form', () => {
  let component;
  let api;
  let state;

  beforeEach(() => {
    api = new ApiStub();
    state = new StateStub();
    component = new NewPair(state, api);
  });

  it('can activate if the user is authenticated', () => {
    expect.assertions(1);
    const redirect = component.canActivate();
    expect(typeof redirect).toBe('object');
  });

  it('can submit when both sireId and dameId have been set', () => {
    expect.assertions(1);
    component.sireId = 42;
    component.dameId = 42;
    expect(component.canSubmit).toBe(true);
  });

  it('cannot re-submit if submission was successful', async () => {
    expect.assertions(1);
    await component.submit();
    expect(component.canSubmit).toBe(false);
  });

  it('sets sireId to the suggested value', async () => {
    expect.assertions(1);
    await component.suggestSire();
    expect(component.sireId).toEqual(42);
  });

  it('sets dameId to the suggested value', async () => {
    expect.assertions(1);
    await component.suggestDame();
    expect(component.dameId).toEqual(42);
  });

  it('can search sire if sireId is a non-numeric string', () => {
    expect.assertions(1);
    component.sireId = 'Hello';
    expect(component.canSearchSire).toBe(true);
  });

  it('can search dame if dameId is a non-numeric string', () => {
    expect.assertions(1);
    component.dameId = 'Hello';
    expect(component.canSearchDame).toBe(true);
  });

  it('replaces the sireId when search is clicked', async () => {
    expect.assertions(1);
    await component.fetchSire();
    expect(component.sireId).toBe(42);
  });

  it('replaces the dameId when search is clicked', async () => {
    expect.assertions(1);
    await component.fetchDame();
    expect(component.dameId).toBe(42);
  });
});
