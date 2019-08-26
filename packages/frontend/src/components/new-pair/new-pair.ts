import { inject } from 'aurelia-dependency-injection';
import { Redirect } from 'aurelia-router';
import { ViewModelState as State } from '../../shared/view-model-state';
import { WebApi } from '../../shared/web-api';

@inject(State, WebApi)
export class NewPair {
  api: WebApi;

  dame: any = {};

  sire: any = {};

  state: State;

  constructor(state: State, api: WebApi) {
    this.api = api;
    this.state = state;
  }

  get hasSireName() {
    return (
      this.sireId &&
      typeof this.sireId === 'string' &&
      this.sireId.length > 3 &&
      isNaN(Number(this.sireId))
    );
  }

  get hasDameName() {
    return (
      this.dameId &&
      typeof this.dameId === 'string' &&
      this.dameId.length > 3 &&
      isNaN(Number(this.dameId))
    );
  }

  get sireId() {
    return this.sire.id;
  }

  set sireId(value) {
    this.sire.id = value;
  }

  get dameId() {
    return this.dame.id;
  }

  set dameId(value) {
    this.dame.id = value;
  }

  canActivate(): boolean | Redirect {
    if (!this.state.authenticated) {
      return new Redirect('sign-in');
    }
    return true;
  }

  async fetchDame() {
    const name = this.dame.id;
    const gender = 'F';
    const dame = await this.fetchDog(name, gender);
    this.dame = dame;
  }

  async fetchSire() {
    const name = this.sire.id;
    const gender = 'M';
    const sire = await this.fetchDog(name, gender);
    this.sire = sire;
  }

  async fetchDog(name, gender) {
    const params = {
      query: {
        name: { $like: `%${name}%` },
        gender: gender,
        ownerId: this.state.user.id,
        $limit: 1,
        $sort: {
          updatedAt: -1
        }
      }
    };
    const { data } = await this.api.service('dogs').find(params);
    console.log(data);
    return data.length > 0 ? data[0] : {};
  }
}
