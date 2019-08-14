import { bindable, customElement } from 'aurelia-templating';

export interface PageModel {
  offset: number;
  route: string;
}

export interface PaginationModel {
  currentIndex: number;
  currentPage: number;
  totalPages: number;
  pages: PageModel[];
}

@customElement('pager')
export class Pager {
  @bindable model!: PaginationModel;
  @bindable label: string = 'Search results';

  get firstPage(): number {
    return 1;
  }

  get lastPage(): number {
    return this.model.totalPages;
  }

  get nextPage(): number {
    return this.model.pages[this.currentIndex].offset + 1;
  }

  get prevPage(): number {
    return this.model.pages[this.currentIndex].offset - 1;
  }

  get currentIndex(): number {
    return this.model.currentIndex;
  }

  get currentPage(): number {
    return this.model.currentPage;
  }

  get canCompose(): boolean {
    return this.lastPage != this.firstPage;
  }

  get pages(): PageModel[] {
    return this.model.pages;
  }
}
