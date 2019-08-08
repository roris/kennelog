import { inject } from 'aurelia-dependency-injection';
import { Redirect } from 'aurelia-router';
import {
  Validator,
  ValidationControllerFactory as ControllerFactory,
  ValidationController,
  validateTrigger,
  ValidationRules
} from 'aurelia-validation';
import * as moment from 'moment';

import { ViewModelState as State } from '../../shared/view-model-state';
import { WebApi } from '../../shared/web-api';

class Dog {
  name: string = '';
  microchipNo: number;
  dob: string = '';
  gender: string;

  sireMicrochipNo: string;
  dameMicrochipNo: string;

  imageFiles: File[] = [];
  breed: string = '';
}

@inject(State, ControllerFactory, Validator, WebApi)
export class NewDog {
  api: WebApi;

  canSubmit: boolean = false;

  controller: ValidationController;

  state: State;

  validator: Validator;

  validated: boolean = false;

  isOwner: boolean = true;

  isBreeder: boolean = true;

  dog: Dog = new Dog();

  constructor(
    state: State,
    controllerFactory: ControllerFactory,
    validator: Validator,
    api: WebApi
  ) {
    this.api = api;

    this.controller = controllerFactory.createForCurrentScope(validator);
    this.controller.validateTrigger = validateTrigger.changeOrBlur;
    this.controller.subscribe(() => this.validateWhole());

    this.validator = validator;

    this.state = state;
  }

  get maxDateOfBirth(): string {
    return moment().format('YYYY-MM-DD');
  }

  validateWhole(): void {
    if (!this.validated) {
      this.validated = true;
    }

    this.validator
      .validateObject(this.dog)
      .then(
        results => (this.canSubmit = results.every(result => result.valid))
      );
  }

  async submit(): Promise<void> {}

  canActivate(): boolean | Redirect {
    if (!this.state.authenticated) {
      return new Redirect('login');
    }
    return true;
  }

  activate() {
    this.setupValidation();
  }

  setupValidation() {
    ValidationRules.ensure<Dog, string>('name')
      .maxLength(255)
      .matches(/^[\x20-\x7F]+$/)
      .withMessage('Name can have ASCII characters only')
      .ensure<string>('microchipNo')
      .displayName('Microchip #')
      .maxLength(15)
      .minLength(9)
      .matches(/^[0-9a-zA-z]+$/)
      .withMessage('${$displayName} can have alphanumeric characters only')
      .ensure<string>('sireMicrochipNo')
      .displayName("Sire's Microchip #")
      .maxLength(15)
      .minLength(9)
      .matches(/^[0-9a-zA-z]+$/)
      .withMessage('${$displayName} can have alphanumeric characters only')
      //
      .ensure<string>('dameMicrochipNo')
      .displayName("Dame's Microchip #")
      .maxLength(15)
      .minLength(9)
      .matches(/^[0-9a-zA-z]+$/)
      .withMessage('${$displayName} can have alphanumeric characters only')
      //
      .ensure<string>('gender')
      .required()
      .withMessage('${displayName} must be selected')
      //
      .ensure<string>('dob')
      .displayName('Date of birth')
      .satisfies(dob => Date.parse(dob) <= Date.now())
      .when(dog => dog.dob != '')
      .withMessage('${$displayName} must be before or on today')
      //
      .ensure<File[]>('imageFiles')
      .displayName('Image')
      .satisfies(imageFiles => imageFiles[0].size <= 300 * 1024)
      .when(dog => dog.imageFiles.length > 0)
      .withMessage(
        '${$displayName} file size must be smaller or equal to 300 KiB'
      )
      .satisfies(imageFiles => imageFiles[0].type.split('/')[0] === 'image')
      .when(dog => dog.imageFiles.length > 0)
      .withMessage('${$displayName} must be an image file (eg: png, jpeg)')
      .ensure<string>('breed')
      .maxLength(255)
      .matches(/^[a-zA-Z ]+$/)
      .withMessage('${$displayName} can contain alphabet characters only')
      .on(this.dog);
  }
}
