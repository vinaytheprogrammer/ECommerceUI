import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { Store } from '@ngrx/store';
import { setToken, setUser } from '../store/auth/auth.actions';
import {
  selectIsAuthenticated,
  selectUser,
  selectIsAdmin,
} from '../store/auth/auth.selectors';
import { take } from 'rxjs/internal/operators/take';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private apiEndpoint = 'http://localhost:3011';

  constructor(private router: Router, private store: Store) {}

  decodeTokenPayload(accessToken: string): any {
    try {
      const payloadBase64 = accessToken.split('.')[1];
      const payloadDecoded = atob(payloadBase64);
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
      const response = await axios.post(`${this.apiEndpoint}/signup`, {
        name,
        email,
        role,
        password,
      });

      if (
        response.data &&
        response.data.accessToken &&
        response.data.refreshToken
      ) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        this.isAuthenticated = true;
        this.putInsideStorage(response.data.accessToken);
      } else {
        console.error('Invalid signup response:', response.data);
        this.isAuthenticated = false;
      }
    } catch (error) {
      console.error('Error during signup:', error);
      this.isAuthenticated = false;
    }
    return this.isAuthenticated;
  }

  async login(name: string, password: string): Promise<boolean> {
    // In a real app, you'd call an API here
    try {
      const response = await axios.post(`${this.apiEndpoint}/login`, {
        name,
        password,
      });

      if (
        response.data &&
        response.data.accessToken &&
        response.data.refreshToken
      ) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        this.isAuthenticated = true;
        console.log(
          'payload: ',
          this.decodeTokenPayload(response.data.accessToken)
        );

        this.putInsideStorage(response.data.accessToken);
        // Example: Using selectors
        this.store
          .select(selectIsAuthenticated)
          .subscribe((isAuthenticated) => {
            console.log('Is Authenticated:  yeah', isAuthenticated);
          });

        this.store.select(selectUser).subscribe((user) => {
          console.log('User: coming from ngrx selector', user);
        });
      } else {
        console.error('Invalid login response:', response.data);
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
      const response = await axios.post(`${this.apiEndpoint}/logout`, {
        refreshToken,
      });
      console.log('Logout response:', response.data);
      console.log('Logout response status of isAdmin:', this.isAdmin());
      if (response.data && response.data.message === 'Logout successful') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.isAuthenticated = false;
        this.store.dispatch(setUser({ user: null })); // Reset user state
      } else {
        console.error('Invalid logout response:', response.data);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }

    // Redirect to login page
    this.router.navigate(['/home']);
  }

  isLoggedIn(): boolean {
    const accessToken = localStorage.getItem('accessToken');
    this.isAuthenticated = !!accessToken; // Update isAuthenticated based on token presence
    return this.isAuthenticated;
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
  
  isAdmin(): boolean {
    let isAdmin: boolean = false;
    this.store
      .select(selectIsAdmin)
      .pipe(take(1)) // Take the first emitted value and complete the observable
      .subscribe((isAdminValue) => {
        console.log('Is Admin: coming from ngrx selector', isAdminValue);
        isAdmin = Boolean(isAdminValue);
      });
    return isAdmin;
  }
}
