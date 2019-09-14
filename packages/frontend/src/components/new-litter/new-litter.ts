import { inject } from 'aurelia-dependency-injection';
import { Redirect } from 'aurelia-router';
import { ViewModelState as State } from '../../shared/view-model-state';
import { WebApi } from '../../shared/web-api';
import { ApiError } from '../../util/api-error';
import { createDog, getDogByNameAndGender } from '../../util/api-helpers';
import moment from 'moment';
import $ from 'jquery';

interface Pup {
  name: any;
  gender: any;
  microchipNo: any;
  breedId: any;
  dateOfBirth: any;
  pupNumber: any;
  canClassify: any;
  imageFile: any;
  hasImage: any;
  classifierError: any;
  isOwner: any;
  isBreeder: any;
  uri: any;
}

@inject(State, WebApi)
export class NewLitter {
  api: WebApi;

  state: State;

  errors: ApiError[] = [];

  datePairedOn: any;

  breeds: any[] = [];

  sire: any = { id: '' };

  dame: any = { id: '' };

  pups: Pup[] = [];

  pupNumber = 0;

  commonDateOfBirth;

  submitted = false;

  isPairer = true;

  constructor(state: State, api: WebApi) {
    this.api = api;
    this.state = state;
    this.fetchBreeds();
  }

  canActivate(): boolean | Redirect {
    if (!this.state.authenticated) {
      return new Redirect('sign-in');
    }
    return true;
  }

  get canSubmit() {
    return (
      this.pups.length > 0 &&
      this.pups.every(pup => !!pup.gender) &&
      !this.submitted
    );
  }

  async submit() {
    try {
      const pair = await this.createPair();
      console.log(`pair = ${pair}`);
      await this.createLitter(pair);
    } catch (error) {
      this.errors.push(new ApiError(error));
    }
  }

  async createPair() {
    const pairsService = this.api.service('pairs');
    if (!this.dameId && !this.sireId) {
      return {};
    }

    const pair: any = {};
    if (this.dameId) {
      pair.dameId = Number(this.dameId);
    }

    if (this.sireId) {
      pair.sireId = Number(this.sireId);
    }

    if (this.datePairedOn) {
      pair.pairedOn = this.datePairedOn;
    }

    if (this.isPairer) {
      pair.pairedBy = this.state.user.id;
    }

    return pairsService.create(pair);
  }

  async createLitter(pair) {
    const littersService = this.api.service('litters');
    const litterParams = { pairId: pair ? pair.id : null };
    const litter = await littersService.create(litterParams);
    console.log(`litter = ${litter}`);
    const pups = await this.createPups(litter);
    console.log(`pups = ${pups}`);
    return this.addPupsToLitter(litter, pups);
  }

  async createPups(litter) {
    // const pups: any[] = [];
    const dogs: any[] = [];
    await Promise.all(
      this.pups.map(async pup => {
        const payload = this.createPupObject(pup);
        const response = await createDog(this.api, payload, pup.uri);
        dogs.push(response);
      })
    );

    return dogs;
  }

  createPupObject(pup) {
    const result: any = {};
    result.gender = pup.gender;

    if (pup.name) {
      result.name = pup.name;
    }

    if (pup.microchipNo) {
      result.microchipNo = pup.microchipNo;
    }

    if (pup.dateOfBirth) {
      result.dateOfBirth = pup.dateOfBirth;
    } else if (this.commonDateOfBirth) {
      result.dateOfBirth = this.commonDateOfBirth;
    }

    if (pup.breedId) {
      result.breedId = pup.breedId;
    }

    result.ownerId = this.state.user.id;
    result.breederId = this.state.user.id;
    return result;
  }

  async addPupsToLitter(litter, pups) {
    await Promise.all(
      pups.map(pup =>
        this.api
          .service('dogs-litters')
          .create({ litterId: litter.id, dogId: pup.id })
      )
    );
    this.submitted = true;
  }

  addPup() {
    this.pupNumber++;

    const pup = {
      breedId: '',
      dateOfBirth: '',
      gender: '',
      hasImage: false,
      imageFile: null,
      isOwner: false,
      isBreeder: false,
      canClassify: false,
      classifierError: null,
      microchipNo: '',
      name: '',
      pupNumber: this.pupNumber,
      uri: ''
    };

    this.pups.push(pup);
  }

  onImageFileChanged(event, pup) {
    const reader = new FileReader();
    pup.hasImage = false;
    pup.imageFile = event.target.files[0];
    pup.classifierError = null;
    pup.canClassify = false;
    pup.uri = '';

    reader.onload = () => {
      const uri =
        typeof reader.result === 'string'
          ? reader.result
          : 'https://via.placeholder.com/224x224?text=Preview';
      const img = document.getElementById(`pupImagePreview${pup.pupNumber}`);
      if (!img) {
        return;
      }

      // Enable the classify button if there is a file, which should
      // almost always be true
      img.onload = () => {
        pup.hasImage = !!pup.imageFile;
        pup.canClassify = !!pup.imageFile;
      };

      img.setAttribute('src', uri);
      pup.uri = uri;
    };

    reader.readAsDataURL(pup.imageFile);
  }

  get canSearchDame() {
    return (
      this.dameId &&
      typeof this.dameId === 'string' &&
      this.dameId.length > 3 &&
      isNaN(Number(this.dameId))
    );
  }

  get canSearchSire() {
    return (
      this.sireId &&
      typeof this.sireId === 'string' &&
      this.sireId.length > 3 &&
      isNaN(Number(this.sireId))
    );
  }

  get sireId() {
    return this.sire.id;
  }

  set sireId(value) {
    this.sire.id = value;
  }

  get dameId() {
    return this.dame.id;
  }

  set dameId(value) {
    this.dame.id = value;
  }

  get maxDateOfBirth() {
    return moment().format('YYYY-MM-DD');
  }

  async searchSire() {
    const name = this.sireId;
    const gender = 'M';
    const ownerId = this.state.user.id;
    const api = this.api;
    this.sire = await getDogByNameAndGender(api, ownerId, name, gender);
  }

  async searchDame() {
    const name = this.dameId;
    const gender = 'F';
    const ownerId = this.state.user.id;
    const api = this.api;
    this.dame = await getDogByNameAndGender(api, ownerId, name, gender);
  }

  removePup(pup) {
    const startIndex = this.pups.findIndex(
      value => value.pupNumber === pup.pupNumber
    );
    if (startIndex !== -1) {
      this.pups.splice(startIndex, 1);
    }
  }

  async classify(pup) {
    const pup_ = pup;
    pup_.canClassify = false;
    pup_.isClassifying = true;
    const uri = pup.uri;

    try {
      const prediction = await this.api.service('classify').get(uri);
      this.selectBreed(pup, prediction.name);
    } catch (error) {
      pup_.classifierError = error;
    }

    pup_.isClassifying = false;
    pup_.canClassify = pup.hasImage;
  }

  selectBreed(pup, name) {
    const breed = this.breeds.filter(breed => breed.name === name);
    if (!breed.length) {
      pup.classifierError = new Error("Could not classify the dog's breed");
    } else {
      pup.breedId = breed[0].id;
    }
  }

  async fetchBreeds() {
    try {
      this.breeds = await this.api.service('breeds').all();
    } catch (error) {
      this.errors.push(new ApiError(error));
    }
  }

  // Remove the alert through bootstrap and then remove the error from the array
  removeError(index, error) {
    $(`#alert${index}`).on('closed.bs.alert', () => {
      this.errors.splice(this.errors.findIndex(error), 1);
    });
  }
}
