/**
 * Defines the keys that are stored by aurelia-store.
 */
export interface AppState {
  authenticated: boolean;
}

/**
 * The initial state used by aurelia-store.
 */
export const initialState: AppState = {
  authenticated: false,
};
