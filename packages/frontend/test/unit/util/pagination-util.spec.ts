import { generatePages } from '../../../src/util/pagination-util';

describe('pagination-utils', () => {
  it('should have a length of 5', () => {
    const pages = generatePages(10, 50);
    expect(pages.length).toBe(5);
  });

  it('should shrink from the left', () => {
    expect(generatePages(100, 100).map(item => item.offset)).toEqual([
      96,
      97,
      98,
      99,
      100
    ]);

    expect(generatePages(98, 100).map(item => item.offset)).toEqual([
      96,
      97,
      98,
      99,
      100
    ]);
  });

  it('should shrink from the right', () => {
    expect(generatePages(1, 10).map(item => item.offset)).toEqual([
      1,
      2,
      3,
      4,
      5
    ]);

    expect(generatePages(3, 10).map(item => item.offset)).toEqual([
      1,
      2,
      3,
      4,
      5
    ]);
  });

  it('should shrink from both sides', () => {
    expect(generatePages(5, 10).map(item => item.offset)).toEqual([
      3,
      4,
      5,
      6,
      7
    ]);
  });

  it('should shrink from both sides', () => {
    expect(generatePages(97, 100).map(item => item.offset)).toEqual([
      95,
      96,
      97,
      98,
      99
    ]);
  });

  it('should shrink from both sides', () => {
    expect(generatePages(4, 10).map(item => item.offset)).toEqual([
      2,
      3,
      4,
      5,
      6
    ]);
  });
});
