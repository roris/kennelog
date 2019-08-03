import { RouteConfig } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';

export const routeMap: RouteConfig[] = [
  {
    route: ['', 'dogs'],
    name: 'dogs',
    title: 'Your dogs',
    moduleId: PLATFORM.moduleName('./components/dogs/breeder-dogs'),
  }
];
