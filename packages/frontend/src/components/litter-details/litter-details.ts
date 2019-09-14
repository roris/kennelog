import { inject } from 'aurelia-framework';
import { Redirect } from 'aurelia-router';
import { ViewModelState as State } from '../../shared/view-model-state';
import { WebApi } from '../../shared/web-api';

@inject(State, WebApi)
export class LitterDetails {
  api;

  state;

  litter;

  pups;

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
      this.litter = { id: id };
      this.fetchLitter(id).catch(error => console.error(error));
    }
  }

  async fetchLitter(id) {
    this.litter = await this.api.service('litters').get(id);
    this.fetchPups(this.litter.id);
  }

  async fetchPups(litterId) {
    const id_ = litterId;
    const params = {
      query: {
        $joinRelation: '[litter]',
        'litter.litterId': id_
      }
    };

    const { data } = await this.api.service('dogs').find(params);
    this.pups = data;
  }
}
