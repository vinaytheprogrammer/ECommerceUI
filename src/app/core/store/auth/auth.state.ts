import { AuthUser } from 'src/app/models/user.model';

export interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
}

export const initialAuthState: AuthState = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
};
