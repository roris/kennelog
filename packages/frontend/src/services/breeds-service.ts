import { inject } from 'aurelia-dependency-injection';
import { Service, Params } from '@feathersjs/feathers';
import { WebApi } from '../shared/web-api';

@inject(WebApi)
export class BreedsService {
  private service_: Service<any>;

  constructor(api: WebApi) {
    this.service_ = api.service('breeds');
  }

  find(params?: Params) {
    return this.service_.find(params);
  }
}
