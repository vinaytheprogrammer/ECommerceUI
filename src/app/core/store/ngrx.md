To implement NgRx in your Angular application, you will need to refactor your `AuthStateService` to use NgRx for state management. Below, I'll guide you step-by-step with comments to help you understand the process.

### Steps to Implement NgRx for Auth State Management

1. **Install NgRx Packages**  
  First, install the required NgRx packages:
  ```bash
  npm install @ngrx/store @ngrx/effects @ngrx/entity @ngrx/store-devtools
  ```

2. **Define the State Interface**  
  Create a new file `auth.state.ts` to define the state interface:
  ```typescript
  // src/app/core/store/auth/auth.state.ts
  export interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
  }

  export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
  }

  export const initialAuthState: AuthState = {
    token: null,
    user: null,
    isAuthenticated: false
  };
  ```

3. **Create Actions**  
  Define actions to describe state changes:
  ```typescript
  // src/app/core/store/auth/auth.actions.ts
  import { createAction, props } from '@ngrx/store';
  import { User } from './auth.state';

  export const setToken = createAction(
    '[Auth] Set Token',
    props<{ token: string }>()
  );

  export const clearState = createAction('[Auth] Clear State');

  export const setUser = createAction(
    '[Auth] Set User',
    props<{ user: User }>()
  );
  ```

4. **Create Reducer**  
  Define how the state changes in response to actions:
  ```typescript
  // src/app/core/store/auth/auth.reducer.ts
  import { createReducer, on } from '@ngrx/store';
  import { initialAuthState, AuthState } from './auth.state';
  import { setToken, clearState, setUser } from './auth.actions';

  export const authReducer = createReducer(
    initialAuthState,
    on(setToken, (state, { token }) => ({
     ...state,
     token,
     isAuthenticated: !!token
    })),
    on(setUser, (state, { user }) => ({
     ...state,
     user
    })),
    on(clearState, () => initialAuthState)
  );
  ```

5. **Register the Reducer in the Store**  
  Add the reducer to your application's store:
  ```typescript
  // src/app/core/store/app.state.ts
  import { ActionReducerMap } from '@ngrx/store';
  import { AuthState } from './auth/auth.state';
  import { authReducer } from './auth/auth.reducer';

  export interface AppState {
    auth: AuthState;
  }

  export const reducers: ActionReducerMap<AppState> = {
    auth: authReducer
  };
  ```

  ```typescript
  // src/app/app.module.ts
  import { StoreModule } from '@ngrx/store';
  import { reducers } from './core/store/app.state';

  @NgModule({
    imports: [
     StoreModule.forRoot(reducers)
    ]
  })
  export class AppModule {}
  ```

6. **Create Selectors**  
  Define selectors to access specific parts of the state:
  ```typescript
  // src/app/core/store/auth/auth.selectors.ts
  import { createSelector, createFeatureSelector } from '@ngrx/store';
  import { AuthState } from './auth.state';

  export const selectAuthState = createFeatureSelector<AuthState>('auth');

  export const selectToken = createSelector(
    selectAuthState,
    (state: AuthState) => state.token
  );

  export const selectUser = createSelector(
    selectAuthState,
    (state: AuthState) => state.user
  );

  export const selectIsAuthenticated = createSelector(
    selectAuthState,
    (state: AuthState) => state.isAuthenticated
  );

  export const selectIsAdmin = createSelector(
    selectAuthState,
    (state: AuthState) => state.user?.role === 'admin'
  );
  ```

7. **Dispatch Actions and Use Selectors**  
  Replace your service logic with NgRx actions and selectors. For example:
  ```typescript
  // Example: Dispatching actions
  this.store.dispatch(setToken({ token: 'your-token' }));
  this.store.dispatch(setUser({ user: { id: '1', username: 'John', email: 'john@example.com', role: 'admin' } }));

  // Example: Using selectors
  this.store.select(selectIsAuthenticated).subscribe(isAuthenticated => {
    console.log('Is Authenticated:', isAuthenticated);
  });
  ```

8. **Effects (Optional)**  
  If you need to handle side effects (e.g., API calls), you can use NgRx Effects. Let me know if you'd like to add this.

This is a high-level overview of how to migrate your `AuthStateService` to NgRx. Let me know if you need help with any specific part!