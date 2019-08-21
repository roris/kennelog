import { RouteConfig } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';

const NewDogForm = PLATFORM.moduleName('./components/new-dog/new-dog');
const NewLitterForm = PLATFORM.moduleName('./components/new-litter/new-litter');
const NewLitterFromPairForm = PLATFORM.moduleName(
  './components/new-litter-from-pair/new-litter-from-pair'
);
const NewPairForm = PLATFORM.moduleName('./components/new-pair/new-pair');
const SignInForm = PLATFORM.moduleName('./components/sign-in/sign-in');
const SignOutForm = PLATFORM.moduleName('./components/sign-out/sign-out');
const SignUpForm = PLATFORM.moduleName('./components/sign-up/sign-up');
const UserDogsList = PLATFORM.moduleName(
  './components/breeder-dogs/breeder-dogs'
);
const UserLittersList = PLATFORM.moduleName(
  './components/user-litters-list/user-litters-list'
);
const UserPairsList = PLATFORM.moduleName(
  './components/user-pairs-list/user-pairs-list'
);

export const routeMap: RouteConfig[] = [
  {
    moduleId: UserDogsList,
    name: 'dogs',
    route: ['', 'dogs', 'home'],
    title: 'Your dogs'
  },
  {
    moduleId: UserDogsList,
    name: 'dogs/page',
    route: ['dogs/page/:page'],
    title: 'Your dogs'
  },
  {
    moduleId: UserDogsList,
    name: 'dogs/breed',
    route: ['dogs/breed/:breed/page/:page'],
    title: 'Your dogs'
  },
  {
    moduleId: UserDogsList,
    name: 'dogs/name',
    route: ['dogs/name/:name/page/:page'],
    title: 'Your dogs'
  },
  {
    moduleId: UserDogsList,
    name: 'dogs/breed/name',
    route: ['dogs/breed/:breed/name/:name/page/:page'],
    title: 'Your dogs'
  },
  {
    moduleId: NewDogForm,
    route: ['dogs/new'],
    name: 'new-dog',
    title: 'Add new dog'
  },
  {
    moduleId: UserPairsList,
    name: 'pairs',
    route: ['pairs'],
    title: 'Your pairs'
  },
  {
    moduleId: UserPairsList,
    name: 'pairs/breed',
    route: ['pairs/breed/:breed/page/:page'],
    title: 'Your pairs'
  },
  {
    moduleId: UserPairsList,
    name: 'pairs/breed/name',
    route: ['pairs/breed/:breed/name/:name/page/:page'],
    title: 'Your pairs'
  },
  {
    moduleId: UserPairsList,
    name: 'pairs/name',
    route: ['pairs/name/:name/page/:page'],
    title: 'Your pairs'
  },
  {
    moduleId: UserPairsList,
    name: 'pairs/page',
    route: ['pairs/page/:page'],
    title: 'Your pairs'
  },
  {
    moduleId: NewPairForm,
    name: 'new-pair',
    route: ['pairs/new'],
    title: 'Create new pair'
  },
  {
    moduleId: UserLittersList,
    name: 'litters',
    route: ['litters'],
    title: 'Your litters'
  },
  {
    moduleId: UserLittersList,
    name: 'litters/breed',
    route: ['litters/breed/:breed/page/:page'],
    title: 'Your litters'
  },
  {
    moduleId: UserLittersList,
    name: 'litters/breed/name',
    route: ['litters/breed/breed:/name/:name/page/:page'],
    title: 'Your litters'
  },
  {
    moduleId: UserLittersList,
    name: 'litters/name',
    route: ['litters/name/:name/page/:page'],
    title: 'Your litters'
  },
  {
    moduleId: UserLittersList,
    name: 'litters/page',
    route: ['litters/page/:page'],
    title: 'Your litters'
  },
  {
    moduleId: NewLitterForm,
    name: 'new-litter',
    route: ['litters/new'],
    title: 'Add a new litter'
  },
  {
    moduleId: NewLitterFromPairForm,
    name: 'new-litter-from-pair',
    route: ['litters/new/from-pair'],
    title: 'Add a new litter'
  },
  {
    moduleId: SignUpForm,
    name: 'sign-up',
    route: ['sign-up', 'register'],
    title: 'Sign Up'
  },
  {
    moduleId: SignInForm,
    name: 'sign-in',
    route: ['sign-in', 'login'],
    title: 'Sign in to Kennelog'
  },
  {
    moduleId: SignOutForm,
    name: 'sign-out',
    route: ['sign-out', 'logout'],
    title: 'Signing out?'
  }
];
