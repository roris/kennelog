import * as authentication from '@feathersjs/authentication';
// Don't remove this comment. It's needed to format import lines nicely.
import sanitizeDog from '../../hooks/sanitize-dog';
import { populateBreed } from '../../hooks/populate-breed';
import { populateImage } from '../../hooks/populate-image';

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
    all: [populateBreed(), populateImage()],
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
