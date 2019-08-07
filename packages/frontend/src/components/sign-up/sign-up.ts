import { inject } from 'aurelia-dependency-injection';
import { Redirect, Router } from 'aurelia-router';
import { Store } from 'aurelia-store';
import validator from 'validator';
import { WebApi } from '../../shared/web-api';
import { ViewModelState as State } from '../../shared/view-model-state';
import { AppState } from 'shared/app-state';

interface Credentials {
  email: string;
  password: string;
  name: string;
  dateOfBirth: string;
  licenseNo: string;
}

@inject(Router, State, Store, WebApi)
export class SignUp {
  email: string = '';

  password: string = '';

  name: string = '';

  dateOfBirth: string = '';

  licenseNo: string = '';

  api: WebApi;

  router: Router;

  state: State;

  store: Store<AppState>;

  constructor(
    router: Router,
    state: State,
    store: Store<AppState>,
    api: WebApi
  ) {
    this.api = api;
    this.router = router;
    this.state = state;
    this.store = store;
  }

  get canSubmit(): boolean {
    const validPassword =
      this.password.length >= 8 && this.password.length <= 72;
    const validName = this.name.length <= 255;
    const validEmail = validator.isEmail(this.email);
    const validDateOfBirth = this.dateOfBirth.length > 0;
    const validLicenseNo = this.licenseNo.length >= 8;

    return (
      validEmail &&
      validPassword &&
      validName &&
      validDateOfBirth &&
      validLicenseNo
    );
  }

  get credentials(): Credentials {
    return {
      email: this.email,
      password: this.password,
      name: this.name,
      dateOfBirth: this.dateOfBirth,
      licenseNo: this.licenseNo
    };
  }

  async signUp(): Promise<void> {
    const user = this.credentials;

    try {
      await this.api.users.create(user);

      const credentials = { email: user.email, password: user.password };
      const response = await this.api.login(credentials);

      if (response.authenticated) {
        this.state.onLogin(this.store, true, response.user);
        this.router.navigateToRoute('dogs');
      }
    } catch (err) {
      // sign up failed
    }
  }

  canActivate(): boolean | Redirect {
    if (this.state.authenticated) {
      return new Redirect('dogs');
    }
    return true;
  }
}
