import { generatePages } from '../../../src/util/pagination-util';

const paramsCb = (offset: number) => {
  return { page: offset };
};

describe('pagination-utils', () => {
  it('should have a length of 5', () => {
    const pages = generatePages(10, 50, paramsCb);
    expect(pages.length).toBe(5);
  });

  it('should shrink from the left', () => {
    const pages1 = generatePages(100, 100, paramsCb).map(item => item.offset);
    expect(pages1).toEqual([96, 97, 98, 99, 100]);
    const pages2 = generatePages(98, 100, paramsCb).map(item => item.offset);
    expect(pages2).toEqual([96, 97, 98, 99, 100]);
  });

  it('should shrink from the right', () => {
    const pages1 = generatePages(1, 10, paramsCb).map(item => item.offset);
    expect(pages1).toEqual([1, 2, 3, 4, 5]);
    const pages2 = generatePages(3, 10, paramsCb).map(item => item.offset);
    expect(pages2).toEqual([1, 2, 3, 4, 5]);
  });

  it('should shrink from both sides', () => {
    const pages = generatePages(5, 10, paramsCb).map(item => item.offset);
    expect(pages).toEqual([3, 4, 5, 6, 7]);
  });

  it('should shrink from both sides', () => {
    const pages1 = generatePages(97, 100, paramsCb).map(item => item.offset);
    expect(pages1).toEqual([95, 96, 97, 98, 99]);

    const pages2 = generatePages(4, 10, paramsCb).map(item => item.offset);
    expect(pages2).toEqual([2, 3, 4, 5, 6]);
  });
});
