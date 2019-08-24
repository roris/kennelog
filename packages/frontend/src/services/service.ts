import { Service as FeathersService, Params } from '@feathersjs/feathers';

export class Service {
  service: FeathersService<any>;

  constructor(service: FeathersService<any>) {
    this.service = service;
  }

  async create(data: Partial<any>[] | Partial<any>, params?) {
    return this.service.create(data, params);
  }

  async get(id, params?: Params) {
    return this.service.get(id, params);
  }

  async find(params?: Params) {
    return this.service.find(params);
  }

  private copyParamsWithQuery(params?) {
    const params_ = params ? Object.assign({}, params) : {};
    params_.query = params_.query ? Object.assign({}, params_.query) : {};
    return params_;
  }

  async count(params?: Params): Promise<number> {
    const params_ = this.copyParamsWithQuery(params);
    params_.query.$limit = 0;
    const { total } = await this.service.find(params_);
    return total;
  }

  async all(params?: Params) {
    const params_ = this.copyParamsWithQuery(params);
    const total = await this.count();
    const result: any[] = [];

    while (result.length < total) {
      params_.query.$skip = result.length;
      const { data } = await this.find(params_);
      result.push(...data);
    }

    return result;
  }
}
