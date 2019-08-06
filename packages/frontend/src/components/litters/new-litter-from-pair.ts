import { inject } from 'aurelia-dependency-injection';
import { Redirect } from 'aurelia-router';
import {SharedState} from '../../shared/shared-state';
import {WebApi} from '../../shared/web-api';

@inject(WebApi,SharedState)
export class NewLitterFromPair {
  api: WebApi;

  sharedState: SharedState;

  constructor(api: WebApi, sharedState: SharedState) {
    this.api = api;
    this.sharedState = sharedState;
  }

  canActivate() : boolean | Redirect {
    if (!this.sharedState.isLoggedIn) {
      return new Redirect('sign-in');
    }
    return true;
  }
}
