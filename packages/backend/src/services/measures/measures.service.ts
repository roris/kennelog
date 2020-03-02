// Initializes the `measures` service on path `/measures`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Measures } from './measures.class';
import { createModel } from '../../models/measures.model';
import hooks from './measures.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    measures: Measures & ServiceAddons<any>;
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
  app.use('/measures', new Measures(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('measures');

  service.hooks(hooks);
}
