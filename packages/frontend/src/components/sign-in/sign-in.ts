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

  constructor(
    router: Router,
    state: State,
    store: Store<AppState>,
    api: WebApi
  ) {
    this.api = api;
    this.router = router;
    this.state = state;
    this.store = store;
  }

  get canSubmit(): boolean {
    return this.email !== '' && this.password !== '';
  }

  async onSignInClicked(): Promise<void> {
    try {
      // login
      const credentials = { email: this.email, password: this.password };
      const response = await this.api.login(credentials);

      // update the application state
      this.state.onLogin(this.store, response.user);

      // navigate to the home page if authenticated
      this.router.navigateToRoute('dogs');
    } catch (error) {
      //
    }
  }

  canActivate(): boolean | Redirect {
    if (this.state.authenticated) {
      return new Redirect('dogs');
    }

    return true;
  }
}
