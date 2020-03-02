// Initializes the `elbow-scores` service on path `/elbow-scores`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { ElbowScores } from './elbow-scores.class';
import { createModel } from '../../models/elbow-scores.model';
import hooks from './elbow-scores.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'elbow-scores': ElbowScores & ServiceAddons<any>;
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
  app.use('/elbow-scores', new ElbowScores(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('elbow-scores');

  service.hooks(hooks);
}
