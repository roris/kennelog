// Initializes the `uploads` service on path `/uploads`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Uploads } from './uploads.class';
import { createModel } from '../../models/uploads.model';
import hooks from './uploads.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    uploads: Uploads & ServiceAddons<any>;
  }
}

export default function(app: Application) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate,
    whitelist: ['$joinRelation']
  };

  // Initialize our service with any options it requires
  app.use('/uploads', new Uploads(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('uploads');

  service.hooks(hooks);
}
