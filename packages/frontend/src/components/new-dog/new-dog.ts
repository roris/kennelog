import { inject } from 'aurelia-dependency-injection';
import { Redirect, Router } from 'aurelia-router';
import {
  Validator,
  ValidationControllerFactory as ControllerFactory,
  ValidationController,
  validateTrigger,
  ValidationRules
} from 'aurelia-validation';
import moment from 'moment';

import { ViewModelState as State } from '../../shared/view-model-state';
import { WebApi } from '../../shared/web-api';

class Dog {
  name: string = '';

  microchipNo: string = '';

  dob: string = '';

  gender: string = '';

  imageFiles: File[] = [];

  breed: string = '';

  get hasImage(): boolean {
    return this.imageFiles.length > 0;
  }
}

@inject(ControllerFactory, Router, State, Validator, WebApi)
export class NewDog {
  api: WebApi;

  controller: ValidationController;

  dog: Dog = new Dog();

  isBreeder: boolean = true;

  isOwner: boolean = true;

  submitting: boolean = false;

  valid: boolean = false;

  validated: boolean = false;

  router: Router;

  state: State;

  validator: Validator;

  constructor(
    controllerFactory: ControllerFactory,
    router: Router,
    state: State,
    validator: Validator,
    api: WebApi
  ) {
    this.api = api;

    this.controller = controllerFactory.createForCurrentScope(validator);
    this.controller.validateTrigger = validateTrigger.changeOrBlur;
    this.controller.subscribe(() => this.validateWhole());

    this.router = router;
    this.state = state;
    this.validator = validator;
  }

  get canSubmit(): boolean {
    return !this.submitting && this.valid;
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
      .then(results => (this.valid = results.every(result => result.valid)));
  }

  async submit(): Promise<void> {
    this.submitting = true;

    try {
      // create the blob first
      if (this.dog.hasImage) {
        const reader = new FileReader();

        reader.addEventListener(
          'load',
          () => {
            this.sendToServer(reader.result)
              .then(() => {})
              .catch(() => {});
          },
          false
        );

        reader.readAsDataURL(this.dog.imageFiles[0]);
      } else {
        await this.sendToServer();
      }
    } catch (error) {}
  }

  async sendToServer(uri?): Promise<void> {
    try {
      let upload;
      const blobsService = this.api.service('blobs');
      const uploadsService = this.api.service('uploads');

      if (uri) {
        const blob = await blobsService.create({ uri: uri });
        upload = await uploadsService.create({ path: blob.id });
      }
      const payload: any = {};
      payload.gender = this.dog.gender;

      if (this.dog.name != '') {
        payload.name = this.dog.name;
      }

      if (this.dog.dob != '') {
        payload.dateOfBirth = this.dog.dob;
      }

      if (this.dog.microchipNo != '') {
        payload.microchipNo = this.dog.microchipNo;
      }

      if (this.isBreeder) {
        payload.breeder = this.state.user.id;
      }

      if (this.isOwner) {
        payload.owner = this.state.user.id;
      }

      if (upload) {
        payload.picture = upload.id;
      }

      const dogsService = this.api.service('dogs');
      await dogsService.create(payload);
    } catch (error) {}

    this.submitting = false;
  }

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
      .matches(/^[0-9a-zA-Z]+$/)
      .withMessage('${$displayName} can have alphanumeric characters only')
      //
      .ensure<string>('gender')
      .required()
      .withMessage('${$displayName} must be selected')
      //
      .ensure<string>('dob')
      .displayName('Date of birth')
      .satisfies(dob => Date.parse(dob) <= Date.now())
      .when(dog => !!dog.dob)
      .withMessage('${$displayName} must be before or on today')
      //
      .ensure<File[]>('imageFiles')
      .displayName('Image')
      .satisfies(imageFiles => imageFiles[0].size <= 10_000_000)
      .when(dog => dog.imageFiles.length > 0)
      .withMessage(
        '${$displayName} file size must be smaller or equal to 10 MB'
      )
      .satisfies(imageFiles => imageFiles[0].type.split('/')[0] === 'image')
      .when(dog => dog.imageFiles.length > 0)
      .withMessage('${$displayName} must be an image file (eg: png, jpeg)')
      .ensure<string>('breed')
      .maxLength(255)
      .matches(/^[a-zA-Z ]+$/)
      .withMessage('${$displayName} can contain alphabet characters only')
      .on(this);
  }
}
