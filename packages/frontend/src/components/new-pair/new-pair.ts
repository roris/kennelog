import { inject } from 'aurelia-dependency-injection';
import { Redirect } from 'aurelia-router';
import { isEmpty } from 'lodash';
import moment from 'moment';
import $ from 'jquery';

import { ViewModelState as State } from '../../shared/view-model-state';
import { WebApi } from '../../shared/web-api';
import { ApiError } from '../../util/api-error';
import { getDogByNameAndGender } from '../../util/api-helpers';

@inject(State, WebApi)
export class NewPair {
  api: WebApi;

  dame: any = {};

  errors: ApiError[] = [];

  dameSuggestError;

  sireSuggestError;

  sire: any = {};

  state: State;

  submitted = false;

  pairedOnDate = '';

  constructor(state: State, api: WebApi) {
    this.api = api;
    this.state = state;
  }

  get canSubmit() {
    return this.hasSireId && this.hasDameId && !this.submitted;
  }

  get hasSireId() {
    return !!this.sireId && !isNaN(Number(this.sireId));
  }

  get hasDameId() {
    return !!this.dameId && !isNaN(Number(this.dameId));
  }

  get canSearchSire() {
    return (
      this.sireId &&
      typeof this.sireId === 'string' &&
      this.sireId.length > 3 &&
      isNaN(Number(this.sireId))
    );
  }

  get canSearchDame() {
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
    const ownerId = this.state.user.id;
    const api = this.api;
    this.dame = await getDogByNameAndGender(api, ownerId, name, gender);
  }

  async fetchSire() {
    const name = this.sire.id;
    const gender = 'M';
    const ownerId = this.state.user.id;
    const api = this.api;
    this.sire = await getDogByNameAndGender(api, ownerId, name, gender);
  }

  stripInvalid(pair) {
    if (!pair.pairedOn) {
      delete pair.pairedOn;
    }
  }

  async suggestDame() {
    try {
      this.dameSuggestError = '';
      const { data } = await this.suggestMate('F');
      const dame = data.length > 0 ? data[0].measure.dog : {};
      this.dame = dame;
      this.dameSuggestError = isEmpty(dame) ? 'No suitable dogs found.' : '';
    } catch (error) {
      this.errors.push(new ApiError(error));
    }
  }

  async submit() {
    this.submitted = false;
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
      await this.api.service('pairs').create(pair);
      this.submitted = true;
    } catch (error) {
      this.errors.push(new ApiError(error));
    }
  }

  async suggestMate(gender) {
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

    const dogs = await this.api.service('hip-scores').find(params);
    return dogs;
  }

  async suggestSire() {
    try {
      this.sireSuggestError = '';
      const { data } = await this.suggestMate('M');
      const sire = data.length > 0 ? data[0].measure.dog : {};
      this.sire = sire;
      this.sireSuggestError = isEmpty(sire) ? 'No suitable dogs found.' : '';
    } catch (error) {
      this.errors.push(new ApiError(error));
    }
  }

  // Remove the alert through bootstrap and then remove the error from the array
  removeError(index, error) {
    $(`#alert${index}`).on('closed.bs.alert', () => {
      this.errors.splice(this.errors.findIndex(error), 1);
    });
  }
}
