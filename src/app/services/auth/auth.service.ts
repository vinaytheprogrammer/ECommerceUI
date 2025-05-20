import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private apiEndpoint ='http://localhost:3011';

  constructor(private http: HttpClient) {}

  login(name: string, password: string): Observable<any> {
    return this.http.post(`${this.apiEndpoint}/login`, { name, password });
  }

  signup(name: string, email: string, password: string, role: string): Observable<any> {
    return this.http.post(`${this.apiEndpoint}/signup`, {
      name,
      email,
      role,
      password,
      permissions: ['2'], // permission for notification service
    });
  }

  getAccessToken(code: string): Observable<any> {
    return this.http.post(`http://localhost:3000/auth/token`, {
      code,
      clientId:  environment.CLIENT_ID,
    });
  }

  refreshToken(refreshToken: string): Observable<any> {
    return this.http.post(`http://localhost:3000/auth/token-refresh`, { refreshToken });
  }

  logout(refreshToken: string): Observable<any> {
    return this.http.post(`${this.apiEndpoint}/logout`, { refreshToken });
  }

  refreshAccessToken(refreshToken: string): Observable<any> {
    return this.http.post(`${this.apiEndpoint}/refresh-token`, { refreshToken });
  }
}
