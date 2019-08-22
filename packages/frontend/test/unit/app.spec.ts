import { App } from '../../src/app';
import { Store } from 'aurelia-store';
import { initialState, AppState as State } from '../../src/shared/app-state';
import { ViewModelState } from '../../src/shared/view-model-state';

const user = { name: 'Nobody', email: 'test@example.com' };
const authenticatedState = JSON.stringify({ user: user, authenticated: true });

class ApiStub {
  async login() {
    return { user: user, ignoreMe: true };
  }
}

class LocalStorageStub {
  store: any;

  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value;
  }

  removeItem(key) {
    delete this.store[key];
  }
}

describe('Frontend App Component', () => {
  let localStorage;
  let component;
  let store;
  let vmState: ViewModelState;
  let api;

  beforeEach(() => {
    localStorage = new LocalStorageStub();
    global.localStorage = localStorage;
    store = new Store<State>(initialState);
    vmState = new ViewModelState(store);
    api = new ApiStub();

    component = new App(store, vmState, api);
  });

  it('sets `ViewModelState.authenticated` to `true` on login', async () => {
    localStorage.setItem('kennelog-store', authenticatedState);

    await component.activate();
    expect(vmState.authenticated).toBeTruthy();
  });

  it('updates `ViewModelState.user` on login', async () => {
    localStorage.setItem('kennelog-store', authenticatedState);
    await component.activate();
    expect(vmState.user).toEqual(user);
  });

  it('updates viewModelState when login fails with 401', async () => {
    expect.assertions(2);

    component.api.login = () => {
      const error = new Error('oops');
      error.code = 401;
    };

    localStorage.setItem('kennelog-store', authenticatedState);
    await component.activate();
    expect(vmState.user).toEqual({});
    expect(vmState.authenticated).toBe(false);
  });

  it('updates the localStorage object when login fails with 401', async () => {
    expect.assertions(1);

    component.api.login = () => {
      const error = new Error('oops');
      error.code = 401;
      throw error;
    };

    localStorage.setItem('kennelog-store', authenticatedState);
    await component.activate();
    const storedState = localStorage.getItem('kennelog-store');
    expect(storedState).toEqual(
      JSON.stringify({ user: {}, authenticated: false })
    );
  });
});
