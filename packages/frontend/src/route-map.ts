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
  },
  {
    route: ['litters/new'],
    name: 'new-litter',
    title: 'Add a new litter',
    moduleId: PLATFORM.moduleName('./components/litters/new-litter')
  },
  {
    route: ['litters/new/from-pair'],
    name: 'new-litter-from-pair',
    title: 'Add a new litter',
    moduleId: PLATFORM.moduleName('./components/litters/new-litter-from-pair')
  }
];
