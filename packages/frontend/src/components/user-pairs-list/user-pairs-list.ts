import { inject } from 'aurelia-dependency-injection';
import { Redirect } from 'aurelia-router';
import $ from 'jquery';

import { Model as PaginationModel } from '../../resources/elements/pager';
import { ViewModelState as State } from '../../shared/view-model-state';
import { WebApi } from '../../shared/web-api';
import { ApiError } from '../../util/api-error';

@inject(State, WebApi)
export class UserPairsList {
  api: WebApi;

  breeds: any[] = [];

  errors: any[] = [];

  paginationModel!: PaginationModel;

  pairs: any[] = [];

  pairsPerPage = 5;

  params: any = { page: 1, breed: null, name: '' };

  state: State;

  constructor(state: State, api: WebApi) {
    this.api = api;
    this.state = state;
    this.fetchBreeds();
    this.paginationModel = new PaginationModel(1, 1, 'pairs/page', () => {});
  }

  get breedFilter() {
    return this.params.breed;
  }

  set breedFilter(value) {
    this.params.breed = value;
    this.applyFilters();
  }

  get idFilter() {
    return this.params.id;
  }

  set idFilter(value) {
    this.params.id = value;
    this.applyFilters();
  }

  get filteredRoute() {
    if (this.breedFilter && this.idFilter) {
      return 'pairs/breed/name';
    } else if (this.breedFilter && !this.idFilter) {
      return 'pairs/breed';
    } else if (!this.breedFilter && this.idFilter) {
      return 'pairs/name';
    } else {
      return 'pairs/page';
    }
  }

  canActivate(): boolean | Redirect {
    if (!this.state.authenticated) {
      return new Redirect('sign-in');
    }

    return true;
  }

  activate(params) {
    const page = params && params.page ? Number(params.page) : 1;
    const id = params && params.id ? Number(params.id) : NaN;
    const breed = params && params.breed ? Number(params.breed) : NaN;
    this.params.page = isNaN(page) ? 1 : page;
    this.params.id = isNaN(id) ? null : id;
    this.params.breed = isNaN(breed) ? null : breed;
    this.applyFilters();
  }

  async fetchBreeds() {
    try {
      this.breeds = await this.api.service('breeds').all();
    } catch (error) {
      this.errors.push(new ApiError(error));
    }
  }

  async fetchPairsCount(query?): Promise<number> {
    const params = {
      query: {
        ...query,
        pairedBy: this.state.user.id
      }
    };

    return this.api.service('pairs').count(params);
  }

  async fetchPairs(query?): Promise<void> {
    try {
      const params = {
        query: {
          ...query,
          pairedBy: this.state.user.id,
          $skip: this.pairsPerPage * (this.params.page - 1),
          $limit: this.pairsPerPage,
          $sort: {
            updatedAt: -1
          }
        }
      };

      const { data } = await this.api.service('pairs').find(params);
      this.pairs = data;
      console.log(data);
    } catch (error) {
      this.errors.push(new ApiError(error));
    }
  }

  removeError(index, error) {
    $(`#alert${index}`).on('closed.bs.alert', () => {
      this.errors.splice(this.errors.findIndex(error), 1);
    });
  }

  private async applyFilters() {
    const breedFilter = this.breedFilter
      ? { $joinRelation: 'sire', breedId: this.breedFilter }
      : {};
    const idFilter = this.idFilter
      ? { id: { $like: `${this.idFilter}%` } }
      : {};

    const query = { ...breedFilter, ...idFilter };

    try {
      const total = await this.fetchPairsCount(query);
      await this.fetchPairs(query);
      this.paginate(Math.ceil(total / this.pairsPerPage));
    } catch (error) {
      console.log(error);
      this.errors.push(new ApiError(error));
    }
  }

  private paginate(total: number) {
    const route = this.filteredRoute;
    const currentPage = this.params.page;
    const routeParams = offset => {
      if (this.breedFilter && this.idFilter) {
        return { breed: this.breedFilter, name: this.idFilter, page: offset };
      } else if (this.breedFilter && !this.idFilter) {
        return { breed: this.breedFilter, page: offset };
      } else if (!this.breedFilter && this.idFilter) {
        return { name: this.idFilter, page: offset };
      } else {
        return { page: offset };
      }
    };

    this.paginationModel.update(total, currentPage, route, routeParams);
  }
}
