import { inject } from 'aurelia-framework';
import { Redirect } from 'aurelia-router';
import moment from 'moment';
import $ from 'jquery';

import { ViewModelState as State } from '../../shared/view-model-state';
import { WebApi } from '../../shared/web-api';
import { ApiError } from '../../util/api-error';

@inject(State, WebApi)
export class DogDetailsOverview {
  api: WebApi;

  state: State;

  dog: any = null;

  sire: any = null;

  dame: any = null;

  errors: ApiError[] = [];

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
    const id = params && !isNaN(Number(params.id)) ? Number(params.id) : 0;
    if (id) {
      this.dog = { id: id };
    }
    this.getDog(id);
  }

  get dateOfBirth() {
    return moment(this.dog.dateOfBirth).format('Do MMMM YYYY');
  }

  get gender() {
    switch (this.dog.gender) {
      case 'M':
        return 'Male';
      case 'F':
        return 'Female';
    }
    return undefined;
  }

  async getDog(id) {
    const id_ = id;
    try {
      this.dog = await this.api.service('dogs').get(id_);
    } catch (error) {
      this.errors.push(new ApiError(error));
    }
  }

  removeError(index, error) {
    $(`#alert${index}`).on('closed.bs.alert', () => {
      this.errors.splice(this.errors.findIndex(error), 1);
    });
  }
}
