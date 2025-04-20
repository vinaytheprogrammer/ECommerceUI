import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private apiEndpoint = 'http://localhost:3011';

  constructor(private router: Router) {}

  async signup(name: string, email: string, password: string, role: string): Promise<boolean> {
    try {
      const response = await axios.post(`${this.apiEndpoint}/signup`, {
        name,
        email,
        role,
        password,
      });

      if (response.data && response.data.accessToken && response.data.refreshToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        this.isAuthenticated = true;
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
      password
    });

    if (response.data && response.data.accessToken && response.data.refreshToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      this.isAuthenticated = true;
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
        refreshToken
      });
      console.log('Logout response:', response.data);
      if (response.data && response.data.message === 'Logout successful') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.isAuthenticated = false;
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
}