import { bootstrap } from 'aurelia-bootstrapper';
import { StageComponent } from 'aurelia-testing';
import { PLATFORM } from 'aurelia-pal';
import { App } from '../../src/app';
import { Store } from 'aurelia-store';
import { initialState, AppState as State } from '../../src/shared/app-state';
import { ViewModelState } from '../../src/shared/view-model-state';
import { async } from 'rxjs/internal/scheduler/async';
import { loginAction } from '../../src/store-actions/login-action';

const user = { name: 'Nobody', email: 'test@example.com' };

class ApiStub {
  async login() {
    return { user: user, ignoreMe: true };
  }
}

describe('Frontend App Component', () => {
  let component;
  let store;
  let vmState: ViewModelState;
  let api;

  beforeEach(() => {
    store = new Store<State>(initialState);
    vmState = new ViewModelState(store);
    api = new ApiStub();

    component = new App(store, vmState, api);
  });

  it('should set ViewModelState.authenticated on login', async () => {
    await component.login();
    expect(vmState.authenticated).toBeTruthy();
  });

  it('should update ViewModelState on login', async () => {
    await component.login();
    expect(vmState.user).toEqual(user);
  });
});
