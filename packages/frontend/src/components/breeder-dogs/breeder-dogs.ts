import { inject } from 'aurelia-dependency-injection';
import { Redirect } from 'aurelia-router';
import { ViewModelState as State } from '../../shared/view-model-state';
import { WebApi } from '../../shared/web-api';
import { Service } from '../../services/service';
import { Model as PaginationModel } from '../../resources/elements/pager';
import moment from 'moment';
import $ from 'jquery';

const tryRefreshing =
  'Try refreshing the page or check your network connection.';

@inject(State, WebApi)
export class BreederDogs {
  api: WebApi;

  breeds: any[] = [];

  dogs;

  errors: any[] = [];

  dogsPerPage = 10;

  paginationModel!: PaginationModel;

  params: any = { page: 1, breed: '', name: '' };

  state: State;

  constructor(state: State, api: WebApi) {
    this.api = api;
    this.state = state;
    this.paginationModel = new PaginationModel(1, 1, 'dogs/page', () => {});
    this.fetchBreeds();
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
    const breed = params && params.breed ? Number(params.breed) : NaN;
    this.params.page = isNaN(page) ? 1 : page;
    this.params.name = name;
    this.params.breed = isNaN(breed) ? null : breed;
    this.applyFilters();
  }

  fetchBreeds() {
    this.api
      .service('breeds')
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
    return this.api.service('dogs').count({
      query: {
        ...query,
        ownerId: this.state.user.id
      }
    });
  }

  async fetchDogs(query?): Promise<void> {
    try {
      const params = {
        query: {
          ...query,
          ownerId: this.state.user.id,
          $skip: this.dogsPerPage * (this.params.page - 1),
          $limit: this.dogsPerPage,
          $sort: {
            updatedAt: -1
          }
        }
      };

      const { data } = await this.api.service('dogs').find(params);
      this.formatDateOfBirth(data);
      this.dogs = data;
    } catch (error) {
      this.errors.push({
        title: 'Error',
        message: `Could not fetch list of your dogs from the server. ${tryRefreshing}.`
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
    const breedFilter = this.breedFilter ? { breedId: this.breedFilter } : {};
    const nameFilter = this.nameFilter
      ? { name: { $like: `${this.nameFilter}%` } }
      : {};

    const query = { ...breedFilter, ...nameFilter };

    const total = await this.fetchDogsCount(query);
    await this.fetchDogs(query);
    this.paginate(Math.ceil(total / this.dogsPerPage));
  }

  private formatDateOfBirth(dogs: any[]) {
    dogs.forEach(dog => {
      dog.dateOfBirth = moment(dog.dateOfBirth).format('dddd, MMMM Do YYYY');
    });
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
