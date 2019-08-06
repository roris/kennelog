import { Service, ObjectionServiceOptions } from 'feathers-objection';

interface Options extends ObjectionServiceOptions {
  Model: any;
}

export class Dogs extends Service {
  constructor(options: Partial<Options>, app: Application) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
}
