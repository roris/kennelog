// Initializes the `dogs-litters` service on path `/dogs-litters`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { DogsLitters } from './dogs-litters.class';
import { createModel } from '../../models/dogs-litters.model';
import hooks from './dogs-litters.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'dogs-litters': DogsLitters & ServiceAddons<any>;
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
  app.use('/dogs-litters', new DogsLitters(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('dogs-litters');

  service.hooks(hooks);
}
