import { User } from 'src/app/models/user.model';

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

export const initialAuthState: AuthState = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
};
