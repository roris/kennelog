import { bindable, customElement } from 'aurelia-templating';
import { generatePages } from '../../util/pagination-util';

export interface Page {
  offset: number;
  params: any;
}

export class Model {
  currentPageIndex: number = 0;
  currentPageNumber: number = 1;
  lastPageNumber: number = 1;
  firstPage!: Page;
  lastPage!: Page;
  nextPage!: Page;
  prevPage!: Page;
  pages: Page[] = [];
  route: string = '';

  constructor(
    total: number,
    current: number,
    route: string,
    params: (offset: number) => any
  ) {
    this.update(total, current, route, params);
  }

  update(
    total: number,
    current: number,
    route: string,
    params: (offset: number) => any
  ) {
    this.pages = generatePages(current, total, params);

    this.route = route;
    this.firstPage = { offset: 1, params: params(1) };
    this.lastPage = { offset: total, params: params(total) };
    this.nextPage = { offset: current + 1, params: params(current + 1) };
    this.prevPage = { offset: current - 1, params: params(current - 1) };
    this.currentPageNumber = current;
    this.lastPageNumber = total;
    this.pages.forEach((page, index) => {
      if (page.offset == this.currentPageNumber) {
        this.currentPageIndex = index;
      }
    });
  }
}

@customElement('pager')
export class Pager {
  @bindable model!: Model;
  @bindable label: string = 'Search results';

  get route(): string {
    return this.model.route;
  }

  get firstPage(): Page {
    return this.model.firstPage;
  }

  get lastPage(): Page {
    return this.model.lastPage;
  }

  get prevPage(): Page {
    return this.model.prevPage;
  }

  get nextPage(): Page {
    return this.model.nextPage;
  }

  get firstPageNumber(): number {
    return 1;
  }

  get lastPageNumber(): number {
    return this.model.lastPageNumber;
  }

  get nextPageNumber(): number {
    return this.model.pages[this.currentIndex].offset + 1;
  }

  get prevPageNumber(): number {
    return this.model.pages[this.currentIndex].offset - 1;
  }

  get currentPageNumber(): number {
    return this.model.currentPageNumber;
  }

  get currentIndex(): number {
    return this.model.currentPageIndex;
  }

  get canCompose(): boolean {
    return this.lastPageNumber != this.firstPageNumber;
  }

  get pages(): Page[] {
    return this.model.pages;
  }

  get onFirstPage(): boolean {
    return this.currentPageNumber == this.firstPageNumber;
  }

  get onLastPage(): boolean {
    return this.currentPageNumber == this.lastPageNumber;
  }
}
