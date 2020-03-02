// Initializes the `lengths` service on path `/lengths`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Lengths } from './lengths.class';
import { createModel } from '../../models/lengths.model';
import hooks from './lengths.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    lengths: Lengths & ServiceAddons<any>;
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
  app.use('/lengths', new Lengths(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('lengths');

  service.hooks(hooks);
}
