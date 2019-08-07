import { inject } from 'aurelia-dependency-injection';
import { Redirect, Router } from 'aurelia-router';
import { Store } from 'aurelia-store';
import { WebApi } from '../../shared/web-api';
import { ViewModelState as State } from '../../shared/view-model-state';
import { AppState } from '../../shared/app-state';

@inject(Router, State, Store, WebApi)
export class SignIn {
  email: string = '';

  password: string = '';

  api: WebApi;

  state: State;

  store: Store<AppState>;

  router: Router;

  constructor(router: Router, state: State, store: Store<AppState>, api: WebApi) {
    this.api = api;
    this.router = router;
    this.state = state;
    this.store = store;
  }

  get canSubmit(): boolean {
    return this.email !== '' && this.password !== '';
  }

  async onSignInClicked(): Promise<void> {
    const credentials = { email: this.email, password: this.password };

    const response = await this.api.login(credentials);
    const authenticated = response.authenticated;
    const user = authenticated ? response.user : {};

    // update the application state
    this.state.onLogin(this.store, authenticated, user);

    // navigate to the home page if authenticated
    if (authenticated) {
      this.router.navigateToRoute('dogs');
    }
  }

  canActivate(): boolean | Redirect {
    if (this.state.authenticated) {
      return new Redirect('dogs');
    }

    return true;
  }
}
