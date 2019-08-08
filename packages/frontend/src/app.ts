import { inject } from 'aurelia-dependency-injection';
import { Router, RouterConfiguration } from 'aurelia-router';
import {
  Store,
  localStorageMiddleware,
  MiddlewarePlacement,
  rehydrateFromLocalStorage
} from 'aurelia-store';
import { Subscription } from 'rxjs';
import { routeMap } from './route-map';
import { WebApi } from './shared/web-api';
import { AppState as State } from './shared/app-state';
import { ViewModelState } from 'shared/view-model-state';

@inject(Store, ViewModelState, WebApi)
export class App {
  api: WebApi;

  router: Router;

  state: State;

  store: Store<State>;

  subscription: Subscription;

  viewModelState: ViewModelState;

  constructor(
    store: Store<State>,
    viewModelState: ViewModelState,
    api: WebApi
  ) {
    this.api = api;
    this.store = store;
    this.viewModelState = viewModelState;
  }

  get authenticated(): boolean {
    return (
      this.viewModelState.authenticated &&
      this.state &&
      this.state.authenticated
    );
  }

  get currentRoute(): string {
    return this.router.currentInstruction.config.name;
  }

  get signingOut(): boolean {
    return this.currentRoute === 'sign-out';
  }

  configureRouter(config: RouterConfiguration, router: Router): void {
    config.title = 'Kennelog';
    config.map(routeMap);
    this.router = router;
  }

  bind(): void {
    this.subscription = this.store.state.subscribe(newState => {
      this.state = newState;
    });

    // load the state from local storage
    this.store.registerMiddleware(
      localStorageMiddleware,

      MiddlewarePlacement.After,

      { key: 'kennelog-store' }
    );
    this.store.registerAction('Rehydrate', rehydrateFromLocalStorage);
    this.store.dispatch(rehydrateFromLocalStorage, 'kennelog-store');
  }

  unbind(): void {
    this.subscription.unsubscribe();
  }

  async activate(): Promise<void> {
    const storedState = JSON.parse(localStorage.getItem('kennelog-store'));
    if (!storedState) {
      return;
    }

    if (storedState.authenticated) {
      const response = await this.api.login();
      const authenticated = response.authenticated;
      const user = authenticated ? response.user : {};

      // update viewModelState only if authentication was successful
      if (authenticated) {
        this.viewModelState.onLogin(this.store, authenticated, user);
      } else if (response.code === 401) {
        storedState.authenticated = false;
        localStorage.setItem('kennelog-store', storedState);
      }
    }
  }
}
