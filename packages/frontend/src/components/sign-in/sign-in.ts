import {inject} from 'aurelia-dependency-injection';
import {Router} from 'aurelia-router';
import {WebApi} from '../../shared/web-api';
import {SharedState} from '../../shared/shared-state';

@inject(WebApi,SharedState,Router)
export class SignIn {
  email: string = '';

  password: string = '';

  api: WebApi;
  sharedState: SharedState;
  router: Router;

  constructor(api: WebApi, sharedState: SharedState, router: Router) {
    this.api = api;
    this.router = router;
    this.sharedState = sharedState;
  }

  get canSubmit(): boolean {
    return this.email !== '' && this.password !== '';
  }

  async login() {
    const credentials = { email: this.email, password: this.password };
    const res = await this.api.login(credentials);
    if (res.success) {
      this.router.navigateToRoute('dogs');
      return true;
    } 
    return false;
  }
}
