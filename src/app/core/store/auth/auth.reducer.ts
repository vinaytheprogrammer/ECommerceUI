import { createReducer, on } from '@ngrx/store';
import { initialAuthState, AuthState } from './auth.state';
import { setToken, clearState, setUser } from './auth.actions';

export const authReducer = createReducer(
  initialAuthState,
  on(setToken, (state, { accessToken }) => ({
   ...state,
   accessToken,
   isAuthenticated: !!accessToken
  })),
  on(setUser, (state, { user }) => ({
   ...state,
   user
  })),
  on(clearState, () => initialAuthState)
);