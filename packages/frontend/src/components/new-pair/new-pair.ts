import { inject } from 'aurelia-dependency-injection';
import { Redirect } from 'aurelia-router';
import { ViewModelState as State } from '../../shared/view-model-state';
import { WebApi } from '../../shared/web-api';
import { ApiError } from '../../util/api-error';
import moment from 'moment';

@inject(State, WebApi)
export class NewPair {
  api: WebApi;

  dame: any = {};

  errors: ApiError[] = [];

  sire: any = {};

  state: State;

  pairedOnDate = '';

  constructor(state: State, api: WebApi) {
    this.api = api;
    this.state = state;
  }

  get canSubmit() {
    return this.hasSireId && this.hasDameId;
  }

  get hasSireId() {
    return !!this.sireId && !isNaN(Number(this.sireId));
  }

  get hasDameId() {
    return !!this.dameId && !isNaN(Number(this.dameId));
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

  get maxPairedOnDate() {
    return moment().format('YYYY-MM-DD');
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
    return data.length > 0 ? data[0] : {};
  }

  stripInvalid(pair) {
    if (!pair.pairedOn) {
      delete pair.pairedOn;
    }
  }

  async suggestDame() {
    const { data } = await this.suggestMate('F');
    const dame = data.length > 0 ? data[0].measure.dog : {};
    this.dame = dame;
  }

  async submit() {
    // This will be called when canSubmit is true, so both Ids will be given.
    // However, they are strings, since input.type=text. :(
    // Making input.type=number means that even if names can be entered, they
    // cannot be used by fetchXXXX functions as they are given as undefined.
    // So they are explicitly to numbers here.
    const pair: any = {
      sireId: Number(this.sireId),
      dameId: Number(this.dameId),
      pairedOn: this.pairedOnDate,
      pairedBy: this.state.user.id
    };

    this.stripInvalid(pair);

    try {
      const result = await this.api.service('pairs').create(pair);
    } catch (error) {
      this.errors.push(new ApiError(error));
    }
  }

  async suggestMate(gender) {
    try {
      const params = {
        query: {
          $joinRelation: '[measure.[dog]]',
          $limit: 1,
          $sort: {
            totalScore: 1,
            'measure.measuredOn': -1
          },
          'measure:dog.gender': gender,
          'measure:dog.ownerId': this.state.user.id
        }
      };

      return this.api.service('hip-scores').find(params);
    } catch (error) {
      this.errors.push(new ApiError(error));
    }
  }

  async suggestSire() {
    const { data } = await this.suggestMate('M');
    const sire = data.length > 0 ? data[0].measure.dog : {};
    this.sire = sire;
  }
}
