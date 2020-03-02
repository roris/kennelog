// Initializes the `dogs` service on path `/dogs`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Dogs } from './dogs.class';
import { createModel } from '../../models/dogs.model';
import hooks from './dogs.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    dogs: Dogs & ServiceAddons<any>;
  }
}

export default function(app: Application) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate,
    whitelist: ['$like', '$joinRelation']
  };

  // Initialize our service with any options it requires
  app.use('/dogs', new Dogs(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('dogs');

  service.hooks(hooks);
}
