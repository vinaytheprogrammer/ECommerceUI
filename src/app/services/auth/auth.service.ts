import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private apiEndpoint = `${environment.authenticationUrl}`;

  constructor(private http: HttpClient) {}

  login(name: string, password: string): Observable<any> {
    return this.http.post(`${this.apiEndpoint}/login`, { username: name, password });
  }

  signup(name: string, email: string, password: string, role: string, google_user_id : string): Observable<any> {
    return this.http.post(`${this.apiEndpoint}/signup`, {
      username: name,
      email,
      role,
      password,
      firstName: name,
    });
  }

  getAccessToken(code: string): Observable<any> {
    return this.http.post(`${environment.OAuth_URL}/auth/token`, {
      code,
      clientId:  environment.CLIENT_ID,
    });
  }
  
  refreshToken(refreshToken: string): Observable<any> {
    return this.http.post(`${environment.OAuth_URL}/auth/token-refresh`, { refreshToken });
  }

  logout(refreshToken: string): Observable<any> {
    return this.http.post(`${this.apiEndpoint}/logout`, { refreshToken });
  }

  refreshAccessToken(refreshToken: string): Observable<any> {
    return this.http.post(`${this.apiEndpoint}/refresh-token`, { refreshTokenId: refreshToken });
  }
}
