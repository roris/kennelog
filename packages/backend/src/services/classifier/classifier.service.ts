import { Service, Application } from '@feathersjs/feathers';
import { MobileNet as Model } from './classifier.model';

class Classifier implements Service<any> {
  model = new Model();

  constructor() {
    // console.log("created classifier service");
    // load the model as soon as the server is started
    this.model
      .load()
      .then()
      .catch(error => console.error(error));
  }

  async get(dataUri) {
    return new Promise((resolve, reject) => {
      this.model
        .predict(dataUri)
        .then(predictions => resolve(predictions))
        .catch(error => reject(error));
    });
  }
}

// register the service and hooks
export const classifier = (app: Application) => {
  // initialize the service
  app.use('/classify', new Classifier());
};
