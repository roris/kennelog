import { inject } from 'aurelia-dependency-injection';
import { Redirect, RouterConfiguration } from 'aurelia-router';
import { ViewModelState as State } from '../../shared/view-model-state';
import { WebApi } from '../../shared/web-api';
import { PaginationModel } from '../../resources/elements/pager';
import { generatePages } from '../../util/pagination-util';

@inject(State, WebApi)
export class BreederDogs {
  dogs;

  breeds;

  api: WebApi;

  state: State;

  paginationModel: PaginationModel = {
    currentIndex: 0,
    currentPage: 1,
    totalPages: 1,
    pages: []
  };

  constructor(state: State, api: WebApi) {
    this.api = api;
    this.state = state;
  }

  canActivate(): boolean | Redirect {
    if (!this.state.authenticated) {
      return new Redirect('sign-in');
    }
    return true;
  }

  paginate(total: number, current: number): void {
    const paginationModel: PaginationModel = {
      totalPages: 1,
      currentPage: 1,
      pages: [],
      currentIndex: 0
    };
    paginationModel.totalPages = total;
    paginationModel.currentPage = current;
    paginationModel.pages = generatePages(
      current,
      total,
      offset => `dogs/pages/${offset}`
    );
    paginationModel.pages.forEach((page, index) => {
      if (page.offset == current) {
        paginationModel.currentIndex = index;
      }
    });
    this.paginationModel = paginationModel;
  }

  async fetchDogs(current): Promise<void> {
    if (isNaN(current) || current == 0) {
      current = 1;
    }

    const totalDogs = await this.getNumberOfDogs();
    const totalPages = Math.ceil(totalDogs / 10);
    this.paginate(totalPages, current);

    const { data } = await this.api.dogs.find({
      query: {
        owner: this.state.user.id,
        $skip: 10 * (current - 1),
        $limit: 10,
        $sort: {
          updatedAt: -1
        }
      }
    });

    this.dogs = data;
  }

  activate(params) {
    if (params && params.page) {
      this.fetchDogs(Number(params.page));
    } else {
      this.fetchDogs(1);
    }
  }

  async getNumberOfDogs(): Promise<number> {
    const { total } = await this.api.dogs.find({
      query: {
        owner: this.state.user.id,
        $limit: 0
      }
    });
    return total;
  }
}
