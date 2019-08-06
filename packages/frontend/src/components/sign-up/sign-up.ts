import {inject} from 'aurelia-dependency-injection';
import {Redirect, Router} from 'aurelia-router';
import validator from 'validator';
import {WebApi} from '../../shared/web-api';
import {SharedState} from '../../shared/shared-state';

interface Credentials {
  email: string,
  password: string,
  name: string,
  dateOfBirth: string,
  licenseNo: string
}

@inject(WebApi,Router,SharedState)
export class SignUp {
  email: string = ''

  password: string = ''

  name: string = ''

  dateOfBirth: string = '';

  licenseNo: string = ''

  api: WebApi;

  router: Router;

  sharedState: sharedState;

  constructor(api: WebApi, router: Router, sharedState: SharedState) {
    this.api = api;
    this.router = router;
    this.sharedState = sharedState;
  }

  get canSubmit(): boolean {
    const validPassword = this.password.length >= 8 && this.password.length <= 72;
    const validName = this.name.length <= 255;
    const validEmail = validator.isEmail(this.email);
    const validDateOfBirth = this.dateOfBirth.length > 0;
    const validLicenseNo = this.licenseNo.length >= 8;

    return validEmail && validPassword && validName && validDateOfBirth && validLicenseNo;
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

  async signUp(): void {
    const user = this.credentials;  
    try {
      await this.api.users.create(user);
      const res = await this.api.login(user);
      if (res.success) {
        this.router.navigateToRoute('dogs');
      }
    } catch (err) {
      // -- login error
    }
  }

  canActivate(): boolean | Redirect {
    if (this.sharedState.isLoggedIn) {
      return new Redirect('dogs');
    }
    return true;
  }
}
