import { inject } from 'aurelia-framework';
import { Redirect } from 'aurelia-router';
import { ViewModelState as State } from '../../shared/view-model-state';
import { WebApi } from '../../shared/web-api';

@inject(State, WebApi)
export class DogDetailsAncestry {
  api;

  state;

  parents;

  maternalGrandparents;

  paternalGrandparents;

  dog;

  constructor(state: State, api: WebApi) {
    this.api = api;
    this.state = state;
  }

  canActivate() {
    if (!this.state.authenticated) {
      return new Redirect('sign-in');
    }
    return true;
  }

  activate(params) {
    const id = params && !isNaN(params.id) ? Number(params.id) : 0;
    if (id) {
      this.dog = { id: id };
      this.getDog(id)
        .then(() => this.getAncestors(id))
        .catch(error => console.error(error))
        .finally(() => console.log('we are done'));
    }
  }

  async getDog(id) {
    const id_ = id;
    try {
      this.dog = await this.api.service('dogs').get(id_);
    } catch (error) {
      console.log(error);
    }
  }

  async getParents(id) {
    return this.findParentsByDogId(id);
  }

  async findParentsByDogId(dogId) {
    const params = {
      query: {
        dogId: dogId
      }
    };
    const dogsLitters = await this.api.service('dogs-litters').find(params);

    if (dogsLitters.data && dogsLitters.data.length) {
      return this.findParentsByLitterId(dogsLitters.data[0].litterId);
    }

    return null;
  }

  async findParentsByLitterId(litterId) {
    console.log('litterId = ', litterId);
    const litter = await this.api.service('litters').get(litterId);
    if (litter) {
      return this.findParentsByPairId(litter.pairId);
    }
    return null;
  }

  findParentsByPairId(pairId) {
    return this.api.service('pairs').get(pairId);
  }

  async getAncestors(id) {
    try {
      console.log('id = ', id);
      const parents = await this.findParentsByDogId(id);
      console.log('found parents');
      this.parents = parents;

      if (parents) {
        this.findParentsByDogId(parents.dame.id)
          .then(result => {
            this.maternalGrandparents = result;
          })
          .catch(() => {});

        this.findParentsByDogId(parents.sire.id)
          .then(result => {
            this.paternalGrandparents = result;
          })
          .catch(() => {});
      }
    } catch (error) {
      console.error(error);
    }
  }
}
