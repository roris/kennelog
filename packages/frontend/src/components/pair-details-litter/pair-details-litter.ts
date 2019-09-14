import { inject } from 'aurelia-framework';
import { Redirect } from 'aurelia-router';
import { ViewModelState as State } from '../../shared/view-model-state';
import { WebApi } from '../../shared/web-api';

@inject(State, WebApi)
export class PairDetailsLitter {
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

      this.fetchLitter(id).catch(error => console.error(error));
    }
  }

  async getPair(id) {
    this.pair = await this.api.service('pairs').get(id);
  }

  async fetchLitter(id) {
    const id_ = id;
    const params = {
      query: {
        pairId: id_
      }
    };
    const { data } = await this.api.service('litters').find(params);

    if (data && data.length > 0) {
      const litterId = data[0].id;
      console.log(data);
      return this.fetchLitterDogs(litterId);
    }

    return null;
  }

  async fetchLitterDogs(id) {
    const id_ = id;
    const params = {
      query: {
        $joinRelation: '[litter]',
        'litter.litterId': id_
      }
    };

    const { data } = await this.api.service('dogs').find(params);
    this.litter = data;
  }
}
