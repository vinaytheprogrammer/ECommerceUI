// auth.meta-reducer.ts
import { MetaReducer } from '@ngrx/store';
import { AppState } from '../app.state'; // Import your AppState interface

export function localStorageSyncReducer(reducer: any): any {
  return (state: any, action: any) => {
    // Load initial state from localStorage
    if (action.type === '@ngrx/store/init') {
      const persistedState = localStorage.getItem('authState');
      if (persistedState) {
        try {
          const parsedState = JSON.parse(persistedState);
          state = {
            ...state,
            auth: {
              ...state?.auth,
              ...parsedState
            }
          };
        } catch (e) {
          console.error('Error parsing persisted state', e);
          localStorage.removeItem('authState');
        }
      }
    }

    // Let the reducer handle the action
    const nextState = reducer(state, action);

    // Save auth state to localStorage after each action
    if (action.type !== '@ngrx/store/init' && nextState?.auth) {
      const stateToPersist = {
        accessToken: nextState.auth.accessToken,
        user: nextState.auth.user,
        isAuthenticated: nextState.auth.isAuthenticated
      };
      localStorage.setItem('authState', JSON.stringify(stateToPersist));
    }

    return nextState;
  };
}

export const metaReducers: MetaReducer<AppState>[] = [localStorageSyncReducer];