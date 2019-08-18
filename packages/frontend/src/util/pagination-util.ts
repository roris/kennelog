import { range } from 'lodash';

export const generatePages = (
  current: number,
  last: number,
  params: (offset: number) => any,
  maxLength: number = 5
) => {
  const upperLimit = Math.min(current + 4, last);
  const lowerLimit = Math.max(current - 4, 1);
  let pages = range(lowerLimit, upperLimit + 1);

  pages = shrinkRight(pages, current, maxLength);
  pages = shrinkLeft(pages, current, maxLength);

  return pages.map(offset => {
    return { offset: offset, params: params(offset) };
  });
};

const shrinkRight = (a: any[], value: any, maxLength: number) => {
  const halfLength = Math.ceil(maxLength / 2);
  while (a.length > maxLength && a.indexOf(value) < a.length - halfLength) {
    a = a.slice(0, a.length - 1);
  }
  return a;
};

const shrinkLeft = (a: any[], value: any, maxLength: number) => {
  const halfLength = Math.ceil(maxLength / 2);
  while (a.length > maxLength && a.indexOf(value) > halfLength - 1) {
    a = a.slice(1, a.length);
  }
  return a;
};
