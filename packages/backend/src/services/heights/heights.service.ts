// Initializes the `heights` service on path `/heights`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Heights } from './heights.class';
import { createModel } from '../../models/heights.model';
import hooks from './heights.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    heights: Heights & ServiceAddons<any>;
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
  app.use('/heights', new Heights(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('heights');

  service.hooks(hooks);
}
