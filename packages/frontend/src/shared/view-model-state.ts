import { AppState } from './app-state';
import { Store } from 'aurelia-store';
import { loginAction } from 'store-actions/login-action';
import { logoutAction } from 'store-actions/logout-action';
import { inject } from 'aurelia-framework';

/**
 * Needed by ViewModels as AppState is not useful from inside canActivate()
 */
@inject(Store)
export class ViewModelState {
  authenticated: boolean = false;

  user: any = {};

  constructor(store: Store<AppState>) {
    store.registerAction('loginAction', loginAction);
    store.registerAction('logoutAction', logoutAction);
  }

  onLogin(store: Store<AppState>, authenticated: boolean, user: any): void {
    this.authenticated = authenticated;
    this.user = user;

    store.dispatch(loginAction, { authenticated: authenticated });
  }

  onLogout(store: Store<AppState>): void {
    this.authenticated = false;
    this.user = {};

    store.dispatch(logoutAction);
  }
}
