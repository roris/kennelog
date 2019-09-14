import { inject } from 'aurelia-dependency-injection';
import { Redirect } from 'aurelia-router';
import $ from 'jquery';

import { Model as PaginationModel } from '../../resources/elements/pager';
import { ViewModelState as State } from '../../shared/view-model-state';
import { WebApi } from '../../shared/web-api';
import { ApiError } from '../../util/api-error';

@inject(State, WebApi)
export class UserLittersList {
  api: WebApi;

  breeds: any[] = [];

  errors: ApiError[] = [];

  litters: any[] = [];

  littersPerPage = 5;

  params: any = {};

  state: State;

  paginationModel: PaginationModel;

  constructor(state: State, api: WebApi) {
    this.api = api;
    this.state = state;
    this.paginationModel = new PaginationModel(1, 1, 'litters/page', () => {});
  }

  activate(params?: any) {
    const name = params && params.name ? params.name : '';
    const page = params && params.page ? Number(params.page) : NaN;
    const breed = params && params.breed ? Number(params.breed) : NaN;

    this.params.breed = isNaN(breed) ? null : breed;
    this.params.page = isNaN(page) ? 1 : page;
    this.params.name = name;

    this.fetchBreeds();
    this.applyFilters();
  }

  get breedFilter() {
    return this.params.breed;
  }

  set breedFilter(value) {
    this.params.breed = value;
    this.applyFilters();
  }

  get filteredRoute() {
    const breed = this.breedFilter;
    const name = this.nameFilter;
    let route = 'litters';
    route += breed ? '/breed' : '';
    route += name ? '/name' : '';
    route += '/page';
    return route;
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

  // Remove the alert through bootstrap and then remove the error from the array
  removeError(index, error) {
    $(`#alert${index}`).on('closed.bs.alert', () => {
      this.errors.splice(this.errors.findIndex(error), 1);
    });
  }

  private async fetchBreeds() {
    try {
      this.breeds = await this.api.service('breeds').all();
    } catch (error) {
      this.errors.push(new ApiError(error));
    }
  }

  private get breedsQuery(): any {
    const breedId = this.breedFilter;
    const query = {
      $joinRelation: '[pair.[dame,sire]]', // override default $joinRelation
      $or: [{ 'pair:sire.breedId': breedId }, { 'pair:dame.breedId': breedId }]
    };

    return breedId ? query : undefined;
  }

  private get namesQuery(): any {
    const name = this.nameFilter;
    const query = {
      $joinRelation: '[pair.[dame,sire]]', // overried default $joinRelation
      $or: [
        { 'pair:sire.name': { $like: `%${name}%` } },
        { 'pair:dame.name': { $like: `%${name}%` } }
      ]
    };

    return name && name.length >= 3 ? query : undefined;
  }

  private get mergedQuery(): any {
    const breedsQuery = this.breedsQuery;
    const namesQuery = this.namesQuery;
    const query: any = {
      $joinRelation: 'pair', // this may be overridden by breedsQuery or namesQuery
      ...breedsQuery,
      ...namesQuery,
      'pair.pairedBy': this.state.user.id
    };

    if (breedsQuery && namesQuery) {
      query.$and = {
        $and: [{ $or: breedsQuery.$or }, { $or: namesQuery.$or }]
      };
      delete query.$or;
    }

    return query;
  }

  private async applyFilters() {
    const query = this.mergedQuery;

    try {
      const total = await this.fetchLittersCount(query);
      const { data } = await this.fetchLitters(query);
      this.litters = data;
      this.paginate(Math.ceil(total / this.littersPerPage));
    } catch (error) {
      this.errors.push(new ApiError(error));
    }
  }

  private async fetchLitters(query?) {
    const params = {
      query: {
        ...query,
        $skip: this.littersPerPage * (this.params.page - 1),
        $limit: this.littersPerPage,
        $sort: {
          updatedAt: -1
        }
      }
    };
    return this.api.service('litters').find(params);
  }

  private async fetchLittersCount(query?) {
    const params = {
      query: {
        ...query
      }
    };

    return this.api.service('litters').count(params);
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
