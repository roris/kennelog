// Initializes the `blobs` service on path `/blobs`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import hooks from './blobs.hooks';

import {Service as BlobService} from 'feathers-blob';
import fs from 'fs-blob-store';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'blobs': BlobService & ServiceAddons<any>;
  }
}

const blobStorage = fs('./content');

export default function (app: Application) {

  // Initialize our service with any options it requires
  app.use('/blobs', new BlobService({ Model: blobStorage}));

  // Get our initialized service so that we can register hooks
  const service = app.service('blobs');

  service.hooks(hooks);
}
