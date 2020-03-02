// Initializes the `events` service on path `/events`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Events } from './events.class';
import { createModel } from '../../models/events.model';
import hooks from './events.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    events: Events & ServiceAddons<any>;
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
  app.use('/events', new Events(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('events');

  service.hooks(hooks);
}
