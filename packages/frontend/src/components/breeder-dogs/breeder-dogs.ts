import { inject } from 'aurelia-dependency-injection';
import { Redirect } from 'aurelia-router';
import { ViewModelState as State } from '../../shared/view-model-state';
import { WebApi } from '../../shared/web-api';
import { Service } from '../../services/service';
import { Model as PaginationModel } from '../../resources/elements/pager';
import $ from 'jquery';

const tryRefreshing =
  'Try refreshing the page or check your network connection.';

@inject(State, WebApi)
export class BreederDogs {
  private breedsService: Service;

  breeds: any[] = [];

  private dogsService: Service;

  dogs;

  errors: any[] = [];

  dogsPerPage = 10;

  ownedBreeds: string[] = [];
  paginationModel!: PaginationModel;

  params: any = { page: 1, breed: '', name: '' };

  state: State;

  constructor(state: State, api: WebApi) {
    this.breedsService = api.service('breeds');
    this.dogsService = api.service('dogs');
    this.state = state;
    this.fetchBreeds();
    this.paginationModel = new PaginationModel(1, 1, 'dogs/page', () => {});
  }

  get filteredRoute() {
    if (this.breedFilter && this.nameFilter) {
      return 'dogs/breed/name';
    } else if (this.breedFilter && !this.nameFilter) {
      return 'dogs/breed';
    } else if (!this.breedFilter && this.nameFilter) {
      return 'dogs/name';
    } else {
      return 'dogs/page';
    }
  }

  get breedFilter() {
    return this.params.breed;
  }

  set breedFilter(value) {
    this.params.breed = value;
    this.applyFilters();
  }

  get nameFilter() {
    return this.params.name;
  }

  set nameFilter(value) {
    this.params.name = value;
    this.applyFilters();
  }

  canActivate(): boolean | Redirect {
    if (!this.state.authenticated) {
      return new Redirect('sign-in');
    }
    return true;
  }

  activate(params) {
    const page = params && params.page ? Number(params.page) : 1;
    const name = params && params.name ? params.name : '';
    const breed = params && params.breed ? Number(params.breed) : 0;
    this.params.page = isNaN(page) ? 1 : page;
    this.params.name = name;
    this.params.breed = isNaN(breed) ? 0 : breed;
    this.applyFilters();
  }

  fetchBreeds() {
    this.breedsService
      .all()
      .then(breeds => (this.breeds = breeds))
      .catch(error =>
        this.errors.push({
          title: 'Error',
          message: `Could not fetch list of dog breeds from the server. ${tryRefreshing}`
        })
      );
  }

  async fetchDogsCount(query?): Promise<number> {
    return this.dogsService.count({
      query: {
        owner: this.state.user.id,
        ...query
      }
    });
  }

  async fetchDogs(query?): Promise<void> {
    try {
      const params = {
        query: {
          ...query,
          owner: this.state.user.id,
          $skip: this.dogsPerPage * (this.params.page - 1),
          $limit: this.dogsPerPage,
          $sort: {
            updatedAt: -1
          }
        }
      };

      const { data } = await this.dogsService.find(params);
      this.dogs = this.populateBreeds(data);
    } catch (error) {
      this.errors.push({
        title: 'Error',
        message: `Could not fetch list of your dogs from the server. ${tryRefreshing}`
      });
    }
  }

  // Remove the alert through bootstrap and then remove the error from the array
  removeError(index, error) {
    $(`#alert${index}`).on('closed.bs.alert', () => {
      this.errors.splice(this.errors.findIndex(error), 1);
    });
  }

  private async applyFilters() {
    const breedFilter = this.breedFilter ? { breed: this.breedFilter } : {};
    const nameFilter = this.nameFilter
      ? { name: { $like: this.nameFilter } }
      : {};

    const query = { ...breedFilter, ...nameFilter };
    console.log('applyFilter.query => ', query);

    const total = await this.fetchDogsCount(query);
    await this.fetchDogs(query);
    this.paginate(Math.ceil(total / this.dogsPerPage));
  }

  private populateBreeds(dogs: any[]) {
    const dict: any = {};
    this.breeds.forEach(breed => (dict[breed.id] = breed.name));
    dogs.forEach(dog => (dog.breed = dict[dog.breed]));
    return dogs;
  }

  private paginate(total: number) {
    const route = this.filteredRoute;
    const currentPage = this.params.page;
    const routeParams = offset => {
      if (this.breedFilter && this.nameFilter) {
        return { breed: this.breedFilter, name: this.nameFilter, page: offset };
      } else if (this.breedFilter && !this.nameFilter) {
        return { breed: this.breedFilter, page: offset };
      } else if (!this.breedFilter && this.nameFilter) {
        return { name: this.nameFilter, page: offset };
      } else {
        return { page: offset };
      }
    };

    this.paginationModel.update(total, currentPage, route, routeParams);
  }
}
