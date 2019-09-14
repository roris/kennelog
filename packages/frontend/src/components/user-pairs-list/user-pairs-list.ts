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

  get nameFilter() {
    return this.params.id;
  }

  set nameFilter(value) {
    this.params.id = value;
    this.applyFilters();
  }

  canActivate(): boolean | Redirect {
    if (!this.state.authenticated) {
      return new Redirect('sign-in');
    }

    return true;
  }

  activate(params) {
    const breed = params && params.breed ? Number(params.breed) : NaN;
    const page = params && params.page ? Number(params.page) : 1;
    const name = params && params.name ? params.name : '';
    this.params.breed = isNaN(breed) ? null : breed;
    this.params.page = isNaN(page) ? 1 : page;
    this.params.name = name;
    this.applyFilters();
  }

  removeError(index, error) {
    $(`#alert${index}`).on('closed.bs.alert', () => {
      this.errors.splice(this.errors.findIndex(error), 1);
    });
  }

  private get breedQuery() {
    const breed = this.breedFilter;
    const query = {
      $joinRelation: '[sire, dame]',
      $or: [{ 'sire.breedId': breed }, { 'dame.breedId': breed }]
    };

    return breed ? query : undefined;
  }

  private async fetchBreeds() {
    try {
      this.breeds = await this.api.service('breeds').all();
    } catch (error) {
      this.errors.push(new ApiError(error));
    }
  }

  private async fetchPairs(query?): Promise<void> {
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
    } catch (error) {
      this.errors.push(new ApiError(error));
    }
  }

  private async fetchPairsCount(query?): Promise<number> {
    const params = {
      query: {
        ...query,
        pairedBy: this.state.user.id
      }
    };

    return this.api.service('pairs').count(params);
  }

  private get filteredRoute() {
    const breed = this.breedFilter;
    const name = this.nameFilter;

    let route = 'pairs';
    route += breed ? '/breed' : '';
    route += name ? '/name' : '';
    route += '/page';
    return route;
  }

  private get mergedQuery() {
    const breedQuery: any = this.breedQuery;
    const nameQuery: any = this.nameQuery;
    const query: any = {
      ...breedQuery,
      ...nameQuery
    };

    if (breedQuery && nameQuery) {
      query.$and = [{ $or: breedQuery.$or }, { $or: nameQuery.$or }];
      delete query.$or;
    }

    return query;
  }

  private get nameQuery() {
    const name: string = this.nameFilter;
    const query = {
      $joinRelation: '[sire, dame]',
      $or: [
        { 'sire.name': { $like: `%${name}%` } },
        { 'dame.name': { $like: `%${name}%` } }
      ]
    };

    return name && name.length >= 3 ? query : undefined;
  }

  private async applyFilters() {
    const query = this.mergedQuery;

    try {
      const total = await this.fetchPairsCount(query);
      await this.fetchPairs(query);
      this.paginate(Math.ceil(total / this.pairsPerPage));
    } catch (error) {
      this.errors.push(new ApiError(error));
    }
  }

  private paginate(total: number) {
    const name = this.nameFilter;
    const breed = this.breedFilter;
    const route = this.filteredRoute;
    const currentPage = this.params.page;
    const routeParams = offset => {
      const params = { breed: breed, name: name, page: offset };
      if (!breed) {
        delete params.breed;
      }
      if (!name) {
        delete params.name;
      }
      return params;
    };

    this.paginationModel.update(total, currentPage, route, routeParams);
  }
}
