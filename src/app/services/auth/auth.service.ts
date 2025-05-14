import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { setToken, setUser } from '../../core/store/auth/auth.actions';
import {
  selectIsAuthenticated,
  selectUser,
  selectIsAdmin,
} from '../../core/store/auth/auth.selectors';
import { take } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private apiEndpoint = 'http://localhost:3011';

  constructor(
    private router: Router,
    private store: Store,
    private http: HttpClient
  ) {}

  decodeTokenPayload(accessToken: string): any {
    try {
      const payloadBase64 = accessToken.split('.')[1];
      const payloadDecoded = atob(payloadBase64); // Decode base64 string
      return JSON.parse(payloadDecoded);
    } catch (error) {
      console.error('Error decoding token payload:', error);
      return null;
    }
  }

  private putInsideStorage(accessToken: string): void {
    this.store.dispatch(setToken({ accessToken }));
    const user = this.decodeTokenPayload(accessToken);
    this.store.dispatch(setUser({ user }));
  }

  async signup(
    name: string,
    email: string,
    password: string,
    role: string
  ): Promise<boolean> {
    try {
      const response: any = await firstValueFrom(
        this.http.post(`${this.apiEndpoint}/signup`, {
          name,
          email,
          role,
          password,
        })
      );

      if (response?.accessToken && response?.refreshToken) {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        this.isAuthenticated = true;
        this.putInsideStorage(response.accessToken);
      } else {
        console.error('Invalid signup response:', response);
        this.isAuthenticated = false;
      }
    } catch (error) {
      console.error('Error during signup:', error);
      this.isAuthenticated = false;
    }
    return this.isAuthenticated;
  }

  async login(name: string, password: string): Promise<boolean> {
    try {
      const response: any = await firstValueFrom(
        this.http.post(`${this.apiEndpoint}/login`, {
          name,
          password,
        })
      );

      if (response?.accessToken && response?.refreshToken) {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        this.isAuthenticated = true;
        console.log('payload:', this.decodeTokenPayload(response.accessToken));
        this.putInsideStorage(response.accessToken);

        this.store.select(selectIsAuthenticated).subscribe((auth) => {
          console.log('Is Authenticated:', auth);
        });

        this.store.select(selectUser).subscribe((user) => {
          console.log('User from selector:', user);
        });
      } else {
        console.error('Invalid login response:', response);
        this.isAuthenticated = false;
      }
    } catch (error) {
      console.error('Error during login:', error);
      this.isAuthenticated = false;
    }
    return this.isAuthenticated;
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response: any = await firstValueFrom(
        this.http.post(`${this.apiEndpoint}/logout`, { refreshToken })
      );
      console.log('Logout response:', response);
      console.log('Logout response status of isAdmin:', this.isAdmin());

      if (response?.message === 'Logout successful') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.isAuthenticated = false;
        this.store.dispatch(setUser({ user: null }));
      } else {
        console.error('Invalid logout response:', response);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }

    this.router.navigate(['/home']);
  }

  isLoggedIn(): boolean {
    const accessToken = localStorage.getItem('accessToken');
    this.isAuthenticated = !!accessToken;
    return this.isAuthenticated;
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  isAdmin(): boolean {
    let isAdmin = false;
    this.store
      .select(selectIsAdmin)
      .pipe(take(1))
      .subscribe((val) => {
        console.log('Is Admin:', val);
        isAdmin = !!val;
      });
    return isAdmin;
  }

  async refreshAccessToken(refreshToken: string): Promise<string | null> {
    try {
      const response: any = await firstValueFrom(
        this.http.post(`${this.apiEndpoint}/refresh-token`, { refreshToken })
      );

      if (response?.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
        this.putInsideStorage(response.accessToken);
        return response.accessToken;
      } else {
        console.error('Invalid refresh token response:', response);
        return null;
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
      return null;
    }
  }

  getCurrentUserId(): string {
    let userId = '';
    this.store
      .select(selectUser)
      .pipe(take(1))
      .subscribe((user) => {
      if (user && user.id) {
        userId = user.id;
      }
      });
    return userId;
  }
}
