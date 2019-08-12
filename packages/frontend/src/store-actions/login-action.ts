import { AppState } from '../shared/app-state';

interface Parameters {
  authenticated: boolean;
}

export function loginAction(oldState: AppState, params: Parameters): AppState {
  const newState = Object.assign({}, oldState);

  newState.authenticated = params.authenticated;

  return newState;
}
