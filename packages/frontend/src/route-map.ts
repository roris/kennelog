import { RouteConfig } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';

export const routeMap: RouteConfig[] = [
  {
    route: ['', 'dogs'],
    name: 'dogs',
    title: 'Your dogs',
    moduleId: PLATFORM.moduleName('./components/dogs/breeder-dogs'),
  },
  {
    route: ['dogs/new'],
    name: 'new-dog',
    title: 'Add new dog',
    moduleId: PLATFORM.moduleName('./components/dogs/new-dog')
  },
  {
    route: ['pairs/new'],
    name: 'new-pair',
    title: 'Create new pair',
    moduleId: PLATFORM.moduleName('./components/pairs/new-pair')
  }
];
