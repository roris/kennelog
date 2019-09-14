/* eslint-disable max-lines */
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
import { ApiError } from '../../util/api-error';
import { createDog } from '../../util/api-helpers';

class Dog {
  name = '';

  microchipNo = '';

  dob = '';

  imageFile;

  gender = '';

  breed = '';
}

const isUniqueMicrochipNo = async (microchipNo: string, api: WebApi) => {
  const total = await api
    .service('dogs')
    .count({ query: { microchipNo: microchipNo } });
  return total === 0;
};

@inject(ControllerFactory, Router, State, Validator, WebApi)
export class NewDog {
  api: WebApi;

  controller: ValidationController;

  dog: Dog = new Dog();

  hasImage = false;

  isBreeder = true;

  isClassifying = false;

  isOwner = true;

  submitting = false;

  valid = false;

  validated = false;

  router: Router;

  state: State;

  validator: Validator;

  breeds: any[] = [];

  errors: ApiError[] = [];

  classifierError: Error;

  /* eslint-disable max-params */
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
  /* eslint-enable max-params */

  get canSubmit(): boolean {
    return !this.submitting && this.valid;
  }

  get maxDateOfBirth(): string {
    return moment().format('YYYY-MM-DD');
  }

  get canClassify() {
    return this.hasImage && !this.isClassifying;
  }

  async classify() {
    this.isClassifying = true;
    const uri = document.getElementById('imagePreview').getAttribute('src');

    try {
      const prediction = await this.api.service('classify').get(uri);
      this.selectBreed(prediction.name);
    } catch (error) {
      this.classifierError = error;
    }

    this.isClassifying = false;
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
      const uri = this.dog.imageFile
        ? document.getElementById('imagePreview').getAttribute('src')
        : undefined;
      const payload = this.createPayload();
      await createDog(this.api, payload, uri);
    } catch (error) {
      this.errors.push(new ApiError(error));
    }

    this.submitting = false;
  }

  /* eslint-disable max-lines-per-function, complexity */
  private createPayload() {
    const payload: any = {};
    payload.gender = this.dog.gender;

    if (this.dog.name) {
      payload.name = this.dog.name;
    }

    if (this.dog.dob) {
      payload.dateOfBirth = this.dog.dob;
    }

    if (this.dog.microchipNo) {
      payload.microchipNo = this.dog.microchipNo;
    }

    if (this.dog.breed) {
      payload.breedId = this.dog.breed;
    }

    if (this.isBreeder) {
      payload.breederId = this.state.user.id;
    }

    if (this.isOwner) {
      payload.ownerId = this.state.user.id;
    }

    return payload;
  }
  /* eslint-enable max-lines-per-function, complexity */

  canActivate(): boolean | Redirect {
    if (!this.state.authenticated) {
      return new Redirect('login');
    }
    return true;
  }

  activate() {
    this.setupValidation();
    this.fetchBreeds();
  }

  // Binding engine is broken for files
  // ref: https://github.com/aurelia/binding/issues/314
  onImageFileChanged(event) {
    const reader = new FileReader();
    this.hasImage = false;
    this.dog.imageFile = event.target.files[0];
    this.classifierError = null;

    reader.onload = () => {
      const uri =
        typeof reader.result === 'string'
          ? reader.result
          : 'https://via.placeholder.com/224x224?text=Preview';
      const img = document.getElementById('imagePreview');

      // Enable the classify button if there is a file, which should
      // almost always be true
      img.onload = () => {
        this.hasImage = !!this.dog.imageFile;
      };

      img.setAttribute('src', uri);
    };

    reader.readAsDataURL(this.dog.imageFile);
  }

  /* eslint-disable max-lines-per-function */
  setupValidation() {
    ValidationRules.ensure<Dog, string>('name')
      .maxLength(255)
      .matches(/^[\x20-\x7F]+$/)
      .withMessage('Name can have ASCII characters only')
      // microchip number
      .ensure<string>('microchipNo')
      .displayName('Microchip #')
      .maxLength(15)
      .minLength(9)
      .matches(/^[0-9a-zA-Z]+$/)
      .withMessage('${$displayName} can have alphanumeric characters only')
      .then()
      .satisfies(microchipNo => isUniqueMicrochipNo(microchipNo, this.api))
      .withMessage('${$displayName} already exists')
      // gender
      .ensure<string>('gender')
      .required()
      .withMessage('${$displayName} must be selected')
      // date of birth
      .ensure<string>('dob')
      .displayName('Date of birth')
      .satisfies(dob => Date.parse(dob) <= Date.now())
      .when(dog => !!dog.dob)
      .withMessage('${$displayName} must be before or on today')
      // image file
      .ensure<File>('imageFile')
      .displayName('Image')
      .satisfies(imageFile => imageFile.size <= 10_000_000)
      .when(dog => dog.imageFile)
      .withMessage(
        '${$displayName} file size must be smaller or equal to 10 MB'
      )
      .satisfies(imageFiles => imageFiles.type.split('/')[0] === 'image')
      .when(dog => dog.imageFile)
      .withMessage('${$displayName} must be an image file (eg: png, jpeg)')
      .on(this.dog);
  }
  /* eslint-enable max-lines-per-function */

  private async fetchBreeds() {
    try {
      this.breeds = await this.api.service('breeds').all();
    } catch (error) {
      this.errors.push(new ApiError(error));
    }
  }

  // find the
  private selectBreed(name) {
    const breed = this.breeds.filter(breed => breed.name === name);
    if (!breed.length) {
      this.classifierError = new Error("Could not classify the dog's breed");
    } else {
      this.dog.breed = breed[0].id;
    }
  }
}
