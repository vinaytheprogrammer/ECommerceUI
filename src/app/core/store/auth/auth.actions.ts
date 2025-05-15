import { createAction, props } from '@ngrx/store';
import { AuthUser } from '../../../models/user.model';

export const setToken = createAction(
  '[Auth] Set Token',
  props<{ accessToken: string }>()
);

export const clearState = createAction('[Auth] Clear State');

export const setUser = createAction(
  '[Auth] Set User',
  props<{ user: AuthUser | null }>()
);