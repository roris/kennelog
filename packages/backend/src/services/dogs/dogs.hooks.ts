import * as authentication from '@feathersjs/authentication';
import sanitizeDog from '../../hooks/sanitize-dog';
import { populateBreed } from '../../hooks/populate-breed';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [sanitizeDog()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [populateBreed()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
