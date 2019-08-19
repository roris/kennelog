import { RouteConfig } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';

const userLittersList = PLATFORM.moduleName(
  './components/user-litters-list/user-litters-list'
);

const userDogsList = PLATFORM.moduleName(
  './components/breeder-dogs/breeder-dogs'
);

const userPairsList = PLATFORM.moduleName(
  './components/user-pairs-list/user-pairs-list'
);

export const routeMap: RouteConfig[] = [
  {
    moduleId: userDogsList,
    name: 'dogs',
    route: ['', 'dogs', 'home'],
    title: 'Your dogs'
  },
  {
    moduleId: userDogsList,
    name: 'dogs/page',
    route: ['dogs/page/:page'],
    title: 'Your dogs'
  },
  {
    moduleId: userDogsList,
    name: 'dogs/breed',
    route: ['dogs/breed/:breed/page/:page'],
    title: 'Your dogs'
  },
  {
    moduleId: userDogsList,
    name: 'dogs/name',
    route: ['dogs/name/:name/page/:page'],
    title: 'Your dogs'
  },
  {
    moduleId: userDogsList,
    name: 'dogs/breed/name',
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
    moduleId: userPairsList,
    name: 'pairs',
    route: ['pairs'],
    title: 'Your pairs'
  },
  {
    moduleId: userPairsList,
    name: 'pairs/breed',
    route: ['pairs/breed/:breed/page/:page'],
    title: 'Your pairs'
  },
  {
    moduleId: userPairsList,
    name: 'pairs/breed/name',
    route: ['pairs/breed/:breed/name/:name/page/:page'],
    title: 'Your pairs'
  },
  {
    moduleId: userPairsList,
    name: 'pairs/name',
    route: ['pairs/name/:name/page/:page'],
    title: 'Your pairs'
  },
  {
    moduleId: userPairsList,
    name: 'pairs/page',
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
    name: 'litters',
    moduleId: userLittersList,
    route: ['litters'],
    title: 'Your litters'
  },
  {
    name: 'litters/breed',
    moduleId: userLittersList,
    route: ['litters/breed/:breed/page/:page'],
    title: 'Your litters'
  },
  {
    name: 'litters/breed/name',
    moduleId: userLittersList,
    route: ['litters/breed/breed:/name/:name/page/:page'],
    title: 'Your litters'
  },
  {
    name: 'litters/name',
    moduleId: userLittersList,
    route: ['litters/name/:name/page/:page'],
    title: 'Your litters'
  },
  {
    name: 'litters/page',
    moduleId: userLittersList,
    route: ['litters/page/:page'],
    title: 'Your litters'
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
