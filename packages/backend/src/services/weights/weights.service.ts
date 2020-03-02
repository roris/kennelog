// Initializes the `weights` service on path `/weights`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Weights } from './weights.class';
import { createModel } from '../../models/weights.model';
import hooks from './weights.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    weights: Weights & ServiceAddons<any>;
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
  app.use('/weights', new Weights(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('weights');

  service.hooks(hooks);
}
