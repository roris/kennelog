// Initializes the `breeds` service on path `/breeds`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Breeds } from './breeds.class';
import { createModel } from '../../models/breeds.model';
import hooks from './breeds.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    breeds: Breeds & ServiceAddons<any>;
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
  app.use('/breeds', new Breeds(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('breeds');

  service.hooks(hooks);
}
