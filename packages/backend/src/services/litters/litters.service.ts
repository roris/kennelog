// Initializes the `litters` service on path `/litters`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Litters } from './litters.class';
import { createModel } from '../../models/litters.model';
import hooks from './litters.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    litters: Litters & ServiceAddons<any>;
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
  app.use('/litters', new Litters(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('litters');

  service.hooks(hooks);
}
