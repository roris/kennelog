import { inject } from 'aurelia-dependency-injection';
import { Redirect } from 'aurelia-router';
import { ViewModelState as State } from '../../shared/view-model-state';
import { WebApi } from '../../shared/web-api';

@inject(State, WebApi)
export class BreederDogs {
  dogs;

  breeds;

  api: WebApi;

  state: State;

  constructor(state: State, api: WebApi) {
    this.api = api;
    this.state = state;
  }

  canActivate(): boolean | Redirect {
    if (!this.state.authenticated) {
      return new Redirect('sign-in');
    }
    return true;
  }
}
