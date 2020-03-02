// Initializes the `pairs` service on path `/pairs`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Pairs } from './pairs.class';
import { createModel } from '../../models/pairs.model';
import hooks from './pairs.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    pairs: Pairs & ServiceAddons<any>;
  }
}

export default function(app: Application) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate,
    whitelist: ['$and', '$like', '$joinRelation']
  };

  // Initialize our service with any options it requires
  app.use('/pairs', new Pairs(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('pairs');

  service.hooks(hooks);
}
