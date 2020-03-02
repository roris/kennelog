// Initializes the `hip-scores` service on path `/hip-scores`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { HipScores } from './hip-scores.class';
import { createModel } from '../../models/hip-scores.model';
import hooks from './hip-scores.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'hip-scores': HipScores & ServiceAddons<any>;
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
  app.use('/hip-scores', new HipScores(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('hip-scores');

  service.hooks(hooks);
}
