import { AppState } from '../shared/app-state';

export function logoutAction(oldState: AppState): AppState {
  const newState: AppState = Object.assign({}, oldState);

  newState.authenticated = false;

  return newState;
}
