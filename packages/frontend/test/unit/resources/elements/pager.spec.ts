import { ComponentTester, StageComponent } from 'aurelia-testing';
import { PLATFORM } from 'aurelia-pal';
import { bootstrap } from 'aurelia-bootstrapper';
import { Pager } from '../../../../src/resources/elements/pager';

const model = {
  currentIndex: 4,
  currentPage: 5,
  totalPages: 10,
  pages: [
    { offset: 1, route: '' },
    { offset: 2, route: '' },
    { offset: 3, route: '' },
    { offset: 4, route: '' },
    { offset: 5, route: '' }
  ]
};

const moduleName = '../../src/resources/elements/pager';

describe('Pager Element', () => {
  let component: ComponentTester<Pager>;

  beforeEach(async () => {
    component = StageComponent.withResources(PLATFORM.moduleName(moduleName))
      .inView('<pager model.bind="model"></pager>')
      .boundTo({ model: model });

    await component.create(bootstrap);
  });

  it('should have 1 as the first page', () => {
    expect(component.viewModel.firstPage).toBe(1);
  });

  it(`should have ${model.totalPages} as the last page`, () => {
    expect(component.viewModel.lastPage).toBe(model.totalPages);
  });

  it(`should have it's current page as ${model.currentPage}`, () => {
    expect(component.viewModel.currentPage).toBe(model.currentPage);
  });

  it(`should have the current index as ${model.currentIndex}`, () => {
    expect(component.viewModel.currentIndex).toBe(model.currentIndex);
  });

  it(`should have the previous page as ${model.currentPage - 1}`, () => {
    expect(component.viewModel.prevPage).toBe(model.currentPage - 1);
  });

  it(`should have the next page as ${model.currentPage + 1}`, () => {
    expect(component.viewModel.nextPage).toBe(model.currentPage + 1);
  });

  it(`should be able to compose`, () => {
    expect(component.viewModel.canCompose).toBeTruthy();
  });

  afterEach(() => {
    component.dispose();
  });
});
