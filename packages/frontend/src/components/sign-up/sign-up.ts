import {inject} from 'aurelia-dependency-injection';
import {Router} from 'aurelia-router';
import validator from 'validator';
import {WebApi} from '../../shared/web-api';

@inject(WebApi,Router)
export class SignUp {
  email: string = ''

  password: string = ''

  name: string = ''

  dateOfBirth: string = '';

  licenseNo: string = ''

  api: WebApi;

  router: Router;

  constructor(api: WebApi, router: Router) {
    this.api = api;
    this.router = router;
  }

  get canSubmit(): boolean {
    const validPassword = this.password.length >= 8 && this.password.length <= 72;
    const validName = this.name.length <= 255;
    const validEmail = validator.isEmail(this.email);
    const validDateOfBirth = this.dateOfBirth.length > 0;
    const validLicenseNo = this.licenseNo.length >= 8;

    return validEmail && validPassword && validName && validDateOfBirth && validLicenseNo;
  }

  get credentials() {
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
}
