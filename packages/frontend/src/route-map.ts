import { RouteConfig } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';

export const routeMap: RouteConfig[] = [
  {
    route: ['', 'dogs', 'home'],
    name: 'dogs',
    title: 'Your dogs',
    moduleId: PLATFORM.moduleName('./components/breeder-dogs/breeder-dogs')
  },
  {
    name: 'dogs/page',
    moduleId: PLATFORM.moduleName('./components/breeder-dogs/breeder-dogs'),
    route: ['dogs/page/:page'],
    title: 'Your dogs'
  },
  {
    name: 'dogs/breed',
    moduleId: PLATFORM.moduleName('./components/breeder-dogs/breeder-dogs'),
    route: ['dogs/breed/:breed/page/:page'],
    title: 'Your dogs'
  },
  {
    name: 'dogs/name',
    moduleId: PLATFORM.moduleName('./components/breeder-dogs/breeder-dogs'),
    route: ['dogs/name/:name/page/:page'],
    title: 'Your dogs'
  },
  {
    name: 'dogs/breed/name',
    moduleId: PLATFORM.moduleName('./components/breeder-dogs/breeder-dogs'),
    route: ['dogs/breed/:breed/name/:name/page/:page'],
    title: 'Your dogs'
  },
  {
    route: ['dogs/new'],
    name: 'new-dog',
    title: 'Add new dog',
    moduleId: PLATFORM.moduleName('./components/new-dog/new-dog')
  },
  {
    name: 'pairs',
    moduleId: PLATFORM.moduleName(
      './components/user-pairs-list/user-pairs-list'
    ),
    route: ['pairs'],
    title: 'Your pairs'
  },
  {
    name: 'pairs/breed',
    moduleId: PLATFORM.moduleName(
      './components/user-pairs-list/user-pairs-list'
    ),
    route: ['pairs/breed/:breed/page/:page'],
    title: 'Your pairs'
  },
  {
    name: 'pairs/breed/name',
    moduleId: PLATFORM.moduleName(
      './components/user-pairs-list/user-pairs-list'
    ),
    route: ['pairs/breed/:breed/id/:id/page/:page'],
    title: 'Your pairs'
  },
  {
    name: 'pairs/name',
    moduleId: PLATFORM.moduleName(
      './components/user-pairs-list/user-pairs-list'
    ),
    route: ['pairs/id/:id/page/:page'],
    title: 'Your pairs'
  },
  {
    name: 'pairs/page',
    moduleId: PLATFORM.moduleName(
      './components/user-pairs-list/user-pairs-list'
    ),
    route: ['pairs/page/:page'],
    title: 'Your pairs'
  },
  {
    route: ['pairs/new'],
    name: 'new-pair',
    title: 'Create new pair',
    moduleId: PLATFORM.moduleName('./components/new-pair/new-pair')
  },
  {
    route: ['litters/new'],
    name: 'new-litter',
    title: 'Add a new litter',
    moduleId: PLATFORM.moduleName('./components/new-litter/new-litter')
  },
  {
    route: ['litters/new/from-pair'],
    name: 'new-litter-from-pair',
    title: 'Add a new litter',
    moduleId: PLATFORM.moduleName(
      './components/new-litter-from-pair/new-litter-from-pair'
    )
  },
  {
    route: ['sign-up', 'register'],
    name: 'sign-up',
    title: 'Sign Up',
    moduleId: PLATFORM.moduleName('./components/sign-up/sign-up')
  },
  {
    route: ['sign-in', 'login'],
    name: 'sign-in',
    title: 'Sign in to Kennelog',
    moduleId: PLATFORM.moduleName('./components/sign-in/sign-in')
  },
  {
    route: ['sign-out', 'logout'],
    name: 'sign-out',
    title: 'Signing out?',
    moduleId: PLATFORM.moduleName('./components/sign-out/sign-out')
  }
];
