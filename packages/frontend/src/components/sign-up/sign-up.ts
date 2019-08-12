import { inject } from 'aurelia-dependency-injection';
import { Redirect, Router } from 'aurelia-router';
import { Store } from 'aurelia-store';
import {
  ValidationController,
  ValidationRules,
  ValidationControllerFactory,
  validateTrigger,
  Validator
} from 'aurelia-validation';
import moment from 'moment';

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

@inject(Router, State, Store, ValidationControllerFactory, Validator, WebApi)
export class SignUp {
  email: string;

  password: string;

  name: string;

  dateOfBirth: string;

  licenseNo: string;

  api: WebApi;

  router: Router;

  state: State;

  store: Store<AppState>;

  controller: ValidationController;

  validated: boolean = false;

  canSubmit: boolean = false;

  validator: Validator;

  // emailErrors = []
  // nameErrors = []
  // passwordErrors = []
  // dateOfBirthErrors = []
  // licenseNoErrors = []

  constructor(
    router: Router,
    state: State,
    store: Store<AppState>,
    controllerFactory: ValidationControllerFactory,
    validator: Validator,
    api: WebApi
  ) {
    this.api = api;

    this.controller = controllerFactory.createForCurrentScope(validator);
    this.controller.validateTrigger = validateTrigger.changeOrBlur;
    this.controller.subscribe(() => this.validateWhole());

    this.validator = validator;

    this.router = router;
    this.state = state;
    this.store = store;
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

  get maxDateOfBirth(): string {
    return moment()
      .subtract(18, 'y')
      .format('YYYY-MM-DD');
  }

  private validateWhole(): void {
    if (!this.validated) {
      this.validated = true;
    }

    this.validator
      .validateObject(this)
      .then(
        results => (this.canSubmit = results.every(result => result.valid))
      );
  }

  async submit(): Promise<void> {
    try {
      await this.api.users.create(this.credentials);
      const response = await this.api.login(this.credentials);
      this.state.onLogin(this.store, response.user);
    } catch (error) {
      // -- what to do?
    }
  }

  canActivate(): boolean | Redirect {
    if (this.state.authenticated) {
      return new Redirect('dogs');
    }
    return true;
  }

  activate() {
    this.setupValidation();
  }

  setupValidation() {
    ValidationRules.ensure<SignUp, string>('email')
      .email()
      .required()
      .maxLength(254)
      .matches(/^[\x20-\x7F]+$/)
      .withMessage('${$displayName} can contain ASCII characters only')
      //
      .ensure<string>('password')
      .required()
      .minLength(8)
      .maxLength(72)
      .matches(/^[\x20-\x7F]+$/)
      .withMessage('${$displayName} can contain ASCII characters only')
      //
      .ensure<string>('name')
      .maxLength(255)
      .matches(/^[\x20-\x7F]+$/)
      .withMessage('${$displayName} can contain ASCII characters only')
      //
      .ensure<string>('dateOfBirth')
      .required()
      .satisfies(
        d =>
          Date.parse(d) <
          moment()
            .subtract(18, 'y')
            .toDate()
            .getMilliseconds()
      )
      .withMessage('You must be at least 18 years old')
      //
      .ensure<string>('licenseNo')
      .required()
      .matches(/^[\x20-\x7F]+$/)
      .withMessage('${$displayName} can contain ASCII characters only')
      .on(this);
  }
}
