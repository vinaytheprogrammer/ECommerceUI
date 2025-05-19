import { MetaReducer } from '@ngrx/store';
import { AppState } from '../app.state'; // Import your AppState interface
import { clearState } from './auth.actions'; // Adjust path if needed
import { AuthState } from './auth.state'; // Ensure you're importing the correct type

// Helper function to persist the state to localStorage
function persistAuthState(state: AuthState | undefined): void {
  if (state) {
    const stateToPersist = {
      accessToken: state.accessToken,
      user: state.user,
      isAuthenticated: state.isAuthenticated,
    };
    localStorage.setItem('authState', JSON.stringify(stateToPersist));
  }
}

// Helper function to clear the persisted auth state
function clearAuthStateFromLocalStorage(): void {
  localStorage.removeItem('authState');
}

export function localStorageSyncReducer(reducer: any): any {
  return (state: any, action: any) => {
    // Load initial state from localStorage only on initialization
    if (action.type === '@ngrx/store/init') {
      const persistedState = localStorage.getItem('authState');
      if (persistedState) {
        try {
          const parsedState = JSON.parse(persistedState);
          state = {
            ...state,
            auth: {
              ...state?.auth,
              ...parsedState,
            },
          };
        } catch (e) {
          console.error('Error parsing persisted state', e);
          clearAuthStateFromLocalStorage();
        }
      }
    }

    // Let the reducer handle the action
    const nextState = reducer(state, action);

    // Handle logout action to clear localStorage
    if (action.type === clearState.type) {
      clearAuthStateFromLocalStorage();
    } else if (nextState?.auth) {
      // Persist the state if there's a valid auth state
      persistAuthState(nextState.auth);
    }

    return nextState;
  };
}

export const metaReducers: MetaReducer<AppState>[] = [localStorageSyncReducer];
