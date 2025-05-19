import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import {
  clearState,
  setToken,
  setUser,
} from '../../core/store/auth/auth.actions';
import {
  selectIsAuthenticated,
  selectUser,
  selectIsAdmin,
} from '../../core/store/auth/auth.selectors';
import { take, tap } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

const googleAuthUrl = environment.API_URL + `auth/google`;

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

  oAuthLogin(url: string) {
    const myform = document.createElement('form');
    const body = {
      client_id:
        environment.CLIENT_ID ,
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      input.value = (body as any)[key]; //NOSONAR
      myform.appendChild(input);
    });
    document.body.appendChild(myform);
    myform.submit();
  }

  loginViaGoogle() {
    this.oAuthLogin(googleAuthUrl);
  }
  getAccessToken(code: string) {
    return this.http
      .post<{
        accessToken: string;
        refreshToken: string;
        expires: number;
      }>(`http://localhost:3000/auth/token`, {
        code: code,
        clientId:
          environment.CLIENT_ID,
      })
      .pipe(
        take(1),
        tap((response) => {
          if (response?.accessToken) {
            this.isAuthenticated = true;
            console.log('payload:', this.decodeTokenPayload(response.accessToken));
            this.putInsideStorage(response.accessToken);
          }
        })
      );
  }

  //OAuth refresh token
  refreshToken(refreshToken: string) {
    return this.http.post(`http://localhost:3000/auth/token-refresh`, {
      refreshToken,
    });
  }

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
      //in case of OAuth tokens
      window.sessionStorage.removeItem('accessToken');
      window.sessionStorage.removeItem('refreshToken');

      this.store.dispatch(clearState());
      this.isAuthenticated = false;
      this.store.dispatch(setUser({ user: null }));

      const refreshToken = localStorage.getItem('refreshToken');
      const response: any = await firstValueFrom(
        this.http.post(`${this.apiEndpoint}/logout`, { refreshToken })
      );
      console.log('Logout response:', response);
      console.log('Logout response status of isAdmin:', this.isAdmin());

      if (response?.message === 'Logout successful') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } else {
        console.error('Invalid logout response:', response);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }

    this.router.navigate(['/home']);
  }

  isLoggedIn(): boolean {
    const authState = localStorage.getItem('authState');
    console.log('Access Token:', authState);
    if (authState) {
      try {
      const parsedState = JSON.parse(authState);
      if (parsedState?.isAuthenticated) {
        console.log('Extracted User:', parsedState.isAuthenticated);
        this.isAuthenticated = parsedState.isAuthenticated;
      }
      } catch (error) {
      console.error('Error parsing authState:', error);
      }
    }
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
