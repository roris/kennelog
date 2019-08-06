import { Router, RouterConfiguration } from 'aurelia-router';
import { routeMap } from './route-map';
import { inject } from 'aurelia-framework';
import { WebApi } from 'shared/web-api';

@inject(WebApi)
export class App {
  api: WebApi;

  router: Router;

  constructor(api: WebApi) {
    this.api = api;
  }

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Kennelog';
    config.map(routeMap);
    this.router = router;
  }
}
