import { inject } from 'aurelia-dependency-injection';
import { Store } from 'aurelia-store';
import { Router, Redirect } from 'aurelia-router';

import { AppState } from '../../shared/app-state';
import { ViewModelState as State } from '../../shared/view-model-state';
import { WebApi } from '../../shared/web-api';

@inject(Router, State, Store, WebApi)
export class SignOut {
  api: WebApi;

  router: Router;

  state: State;

  store: Store<AppState>;

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

  async submit(): Promise<void> {
    try {
      const response = await this.api.logout();
      this.state.onLogout(this.store);
      this.router.navigateToRoute('sign-in');
    } catch (error) {
      // ??
    }
  }

  canActivate(): boolean | Redirect {
    if (this.state.authenticated) {
      return true;
    }

    return new Redirect('sign-in');
  }
}
