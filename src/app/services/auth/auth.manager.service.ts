import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from './auth.service';
import {
  setToken,
  setUser,
  clearState,
} from '../../core/store/auth/auth.actions';
import {
  selectUser,
  selectIsAdmin,
} from '../../core/store/auth/auth.selectors';
import { firstValueFrom, take } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthManagerService {
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private store: Store,
    private authService: AuthService
  ) {}

  oAuthLogin(url: string) {
    const myform = document.createElement('form');
    const body = {
      client_id: environment.CLIENT_ID,
      client_secret: environment.CLIENT_SECRET,
    };
    myform.method = 'POST';
    myform.action = url;
    myform.style.display = 'none';
    myform.append('Content-Type', 'application/x-www-form-urlencoded');
    Object.keys(body).forEach((key) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = (body as any)[key];
      myform.appendChild(input);
    });
    document.body.appendChild(myform);
    myform.submit();
  }

  loginViaGoogle() {
    // const googleAuthUrl = 'http://localhost:3000/auth/google'; // optionally from env
    const googleAuthUrl = environment.OAuth_URL + '/auth/google';
    this.oAuthLogin(googleAuthUrl);

    const code = window.sessionStorage.getItem('authCode');
    if (code) {
      this.getAccessToken(code)
        .then(() => {
          window.sessionStorage.removeItem('authCode');
          this.router.navigate(['/home']);
        })
        .catch((error) => {
          console.error('Error getting access token:', error);
        });
    }
  }

  async login(name: string, password: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.authService.login(name, password)
      );
      if (response?.accessToken && response?.refreshToken) {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        this.isAuthenticated = true;
        this.putInsideStorage(response.accessToken);
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

  async signup(
    name: string,
    email: string,
    password: string,
    role: string
  ): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.authService.signup(name, email, password, role)
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
      console.log('Error during signup:', error);
      alert((error as any).error.error.message);

      this.isAuthenticated = false;
    }
    return this.isAuthenticated;
  }

  async getAccessToken(code: string): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.authService.getAccessToken(code)
      );
      if (response?.accessToken) {
        this.isAuthenticated = true;
        console.log('Access token:', response.accessToken);
        this.putInsideStorage(response.accessToken);
      }
    } catch (error) {
      console.error('Error getting access token:', error);
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<string | null> {
    try {
      const response = await firstValueFrom(
        this.authService.refreshAccessToken(refreshToken)
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
      console.error('Error refreshing token:', error);
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      window.sessionStorage.removeItem('accessToken');
      localStorage.removeItem('authState');
      window.sessionStorage.removeItem('authCode');
      localStorage.removeItem('accessToken');

      this.store.dispatch(clearState());
      this.isAuthenticated = false;
      this.store.dispatch(setUser({ user: null }));

      const refreshToken = localStorage.getItem('refreshToken');
      const response = await firstValueFrom(
        this.authService.logout(refreshToken ?? '')
      );

      if (response?.message === 'Logout successful') {
        localStorage.removeItem('refreshToken'); //Http Bearer Token
        window.sessionStorage.removeItem('refreshToken'); //OAuth Token
      } else {
        console.error('Invalid logout response:', response);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }

    this.router.navigate(['/home']);
  }

  decodeTokenPayload(accessToken: string): any {
    try {
      const payloadBase64 = accessToken.split('.')[1];
      const payloadDecoded = atob(payloadBase64);
      return JSON.parse(payloadDecoded);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  private putInsideStorage(accessToken: string): void {
    this.store.dispatch(setToken({ accessToken }));
    const user = this.decodeTokenPayload(accessToken);
    this.store.dispatch(setUser({ user }));
  }

  isLoggedIn(): boolean {
    const authState = localStorage.getItem('authState');
    if (authState) {
      try {
        const parsedState = JSON.parse(authState);
        if (parsedState?.isAuthenticated) {
          this.isAuthenticated = parsedState.isAuthenticated;
        }
      } catch (error) {
        console.error('Error parsing authState:', error);
      }
    }
    return this.isAuthenticated;
  }

  isAdmin(): boolean {
    let isAdmin = false;
    this.store
      .select(selectIsAdmin)
      .pipe(take(1))
      .subscribe((val) => {
        isAdmin = !!val;
      });
    return isAdmin;
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

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
