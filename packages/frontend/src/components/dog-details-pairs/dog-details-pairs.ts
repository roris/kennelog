import { inject } from 'aurelia-framework';
import { Redirect } from 'aurelia-router';

import { ViewModelState as State } from '../../shared/view-model-state';
import { WebApi } from '../../shared/web-api';

@inject(State, WebApi)
export class DogDetailsPairs {
  api;

  state;

  pairs;

  dog;

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
      this.dog = { id: id };
      this.getDog(id)
        .then(() => this.getPairs(id))
        .catch(error => console.error(error))
        .finally(() => console.log('we are done'));
    }
  }

  async getDog(id) {
    const id_ = id;
    try {
      this.dog = await this.api.service('dogs').get(id_);
      console.log('what?');
    } catch (error) {
      console.error(error);
    }
  }

  async getPairs(id) {
    const params = {
      query: {
        pairedBy: this.state.user.id,
        $or: {
          sireId: id,
          dameId: id
        }
      }
    };

    try {
      console.log('fetching pairs with query = ', params);
      const { data } = await this.api.service('pairs').find(params);
      this.pairs = data.map(pair => {
        pair.partner =
          Number(pair.sireId) === Number(id) ? pair.dame : pair.sire;
        console.log(pair);
        return pair;
      });
    } catch (error) {
      console.error(error);
      console.error('something unexpected happened');
    }
  }
}
