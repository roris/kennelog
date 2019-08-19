import { ComponentTester, StageComponent } from 'aurelia-testing';
import { PLATFORM } from 'aurelia-pal';
import { bootstrap } from 'aurelia-bootstrapper';
import { Pager, Model } from '../../../../src/resources/elements/pager';

const model: Model = new Model(10, 1, 'nowhere', offset => {
  return { page: offset };
});

const moduleName = '../../src/resources/elements/pager';

describe('Pager Element', () => {
  let component: ComponentTester<Pager>;

  beforeEach(async () => {
    component = StageComponent.withResources(PLATFORM.moduleName(moduleName))
      .inView('<pager model.bind="model"></pager>')
      .boundTo({ model: model });

    await component.create(bootstrap);
  });

  it('should have 1 as the first page number', () => {
    expect(component.viewModel.firstPageNumber).toBe(1);
  });

  it(`should have ${model.lastPageNumber} as the last page number`, () => {
    expect(component.viewModel.lastPageNumber).toBe(model.lastPageNumber);
  });

  it(`should have it's current page as ${model.currentPageNumber}`, () => {
    expect(component.viewModel.currentPageNumber).toBe(model.currentPageNumber);
  });

  it(`should have the current index as ${model.currentPageIndex}`, () => {
    expect(component.viewModel.currentIndex).toBe(model.currentPageIndex);
  });

  it(`should have the previous page as ${model.prevPage.offset}`, () => {
    expect(component.viewModel.prevPageNumber).toBe(model.prevPage.offset);
  });

  it(`should have the next page as ${model.nextPage.offset + 1}`, () => {
    expect(component.viewModel.nextPageNumber).toBe(model.nextPage.offset);
  });

  it(`should hold a maximum of 5 pages`, () => {
    expect(model.pages.length).toBe(5);
  });

  it(`should be able to compose`, () => {
    expect(component.viewModel.canCompose).toBeTruthy();
  });

  afterEach(() => {
    component.dispose();
  });
});
