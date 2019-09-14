import { inject } from 'aurelia-framework';
import { Redirect } from 'aurelia-router';
import { ViewModelState as State } from '../../shared/view-model-state';
import { WebApi } from '../../shared/web-api';

@inject(State, WebApi)
export class PairDetailsOverview {
  api;

  state;

  pair;

  litter;

  constructor(state: State, api: WebApi) {
    this.api = api;
    this.state = state;
  }

  canActivate() {
    if (!this.state.authenticated) {
      return new Redirect('sign-in');
    }
    return true;
  }

  activate(params) {
    const id = params && !isNaN(params.id) ? Number(params.id) : 0;
    if (id) {
      this.pair = { id: id };
      this.getPair(id).catch(error => console.error(error));
    }
  }

  async getPair(id) {
    this.pair = await this.api.service('pairs').get(id);
  }
}
