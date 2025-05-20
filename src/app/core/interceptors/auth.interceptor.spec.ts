import { TestBed } from '@angular/core/testing';
import { AuthInterceptor } from './auth.interceptor';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthManagerService } from '../../services/auth/auth.manager.service';

fdescribe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authManagerServiceSpy: jasmine.SpyObj<AuthManagerService>;

  const dummyUrl = '/api/test';

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthManagerService', ['refreshAccessToken', 'logout']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthManagerService, useValue: spy },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    authManagerServiceSpy = TestBed.inject(AuthManagerService) as jasmine.SpyObj<AuthManagerService>;
  });

  afterEach(() => {
    localStorage.clear();
    httpMock.verify();
  });

  it('should add Authorization header when accessToken is available', () => {
    localStorage.setItem('accessToken', 'valid-token');

    httpClient.get(dummyUrl).subscribe();

    const req = httpMock.expectOne(dummyUrl);
    expect(req.request.headers.get('Authorization')).toBe('Bearer valid-token');
    req.flush({});
  });


  it('should logout if refresh token is not available on 401', () => {
    localStorage.setItem('accessToken', 'expired-token');
    localStorage.removeItem('refreshToken');

    httpClient.get(dummyUrl).subscribe({
      error: err => {
        expect(err).toBe('No refresh token available');
        expect(authManagerServiceSpy.logout).toHaveBeenCalled();
      }
    });

    const req = httpMock.expectOne(dummyUrl);
    req.flush({}, { status: 401, statusText: 'Unauthorized' });
  });
});
