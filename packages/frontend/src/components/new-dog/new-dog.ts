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

class Dog {
  name: string = '';

  microchipNo: string = '';

  dob: string = '';

  imageFile;

  gender: string = '';

  breed: string = '';
}

const isUniqueMicrochipNo = async (microchipNo: string, api: WebApi) => {
  const total = await api
    .service('dogs')
    .count({ query: { microchipNo: microchipNo } });
  return total == 0;
};

@inject(ControllerFactory, Router, State, Validator, WebApi)
export class NewDog {
  api: WebApi;

  controller: ValidationController;

  dog: Dog = new Dog();

  canClassify: boolean = false;

  isBreeder: boolean = true;

  isOwner: boolean = true;

  submitting: boolean = false;

  valid: boolean = false;

  validated: boolean = false;

  router: Router;

  state: State;

  validator: Validator;

  breeds: any[] = [];

  errors: ApiError[] = [];

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

  async classify() {
    // TODO
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
      if (this.canClassify) {
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

        reader.readAsDataURL(this.imageFile);
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

      if (this.dog.name) {
        payload.name = this.dog.name;
      }

      if (this.dog.breed) {
        payload.breedId = this.dog.breed;
      }

      if (this.dog.dob) {
        payload.dateOfBirth = this.dog.dob;
      }

      if (this.dog.microchipNo) {
        payload.microchipNo = this.dog.microchipNo;
      }

      if (this.isBreeder) {
        payload.breederId = this.state.user.id;
      }

      if (this.isOwner) {
        payload.ownerId = this.state.user.id;
      }

      if (upload) {
        payload.pictureId = upload.id;
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
    this.fetchBreeds();
  }

  // Binding engine is broken for files
  // ref: https://github.com/aurelia/binding/issues/314
  onImageFileChanged(event) {
    const reader = new FileReader();
    this.canClassify = false;
    this.dog.imageFile = event.target.files[0];

    reader.onload = () => {
      const uri =
        typeof reader.result === 'string'
          ? reader.result
          : 'https://via.placeholder.com/224x224?text=Preview';
      const img = document.getElementById('imagePreview')!;

      // Enable the classify button if there is a file, which should
      // almost always be true
      img.onload = () => {
        this.canClassify = !!this.dog.imageFile;
      };

      img.setAttribute('src', uri);
    };

    reader.readAsDataURL(this.dog.imageFile);
  }

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

  private async fetchBreeds() {
    try {
      this.breeds = await this.api.service('breeds').all();
    } catch (error) {
      this.errors.push(new ApiError(error));
    }
  }
}
