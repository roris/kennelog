import { Router, RouterConfiguration } from 'aurelia-router';
import { routeMap } from './route-map';

export class App {
  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = "Kennelog";
    config.map(routeMap);
  }
}