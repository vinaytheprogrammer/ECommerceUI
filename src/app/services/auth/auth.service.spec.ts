import { TestBed } from '@angular/core/testing';
import { AuthManagerService } from './auth.manager.service';
import { AuthService } from './auth.service';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { clearState } from '../../core/store/auth/auth.actions';

fdescribe('AuthManagerService', () => {
  let service: AuthManagerService;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let storeSpy: jasmine.SpyObj<Store>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login', 'signup', 'logout', 'getAccessToken', 'refreshAccessToken']);
    const storeMock = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthManagerService,
        { provide: AuthService, useValue: authSpy },
        { provide: Store, useValue: storeMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    service = TestBed.inject(AuthManagerService);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    storeSpy = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login and store tokens', async () => {
      const mockResponse = { accessToken: 'abc.def.ghi', refreshToken: 'refreshToken' };
      authServiceSpy.login.and.returnValue(of(mockResponse));
      spyOn(service as any, 'putInsideStorage');

      const result = await service.login('test', 'password');

      expect(result).toBeTrue();
      expect(localStorage.getItem('accessToken')).toBe('abc.def.ghi');
      expect(localStorage.getItem('refreshToken')).toBe('refreshToken');
      expect((service as any).putInsideStorage).toHaveBeenCalledWith('abc.def.ghi');
    });

    it('should handle login failure', async () => {
      authServiceSpy.login.and.returnValue(throwError(() => new Error('Login error')));

      const result = await service.login('test', 'password');

      expect(result).toBeFalse();
    });
  });

  describe('signup', () => {
    it('should signup and store tokens', async () => {
      const mockResponse = { accessToken: 'abc.def.ghi', refreshToken: 'refreshToken' };
      authServiceSpy.signup.and.returnValue(of(mockResponse));
      spyOn(service as any, 'putInsideStorage');

      const result = await service.signup('John', 'john@example.com', 'pass', 'user');

      expect(result).toBeTrue();
      expect(localStorage.getItem('accessToken')).toBe('abc.def.ghi');
      expect(localStorage.getItem('refreshToken')).toBe('refreshToken');
      expect((service as any).putInsideStorage).toHaveBeenCalledWith('abc.def.ghi');
    });

    it('should handle signup failure', async () => {
      authServiceSpy.signup.and.returnValue(throwError(() => new Error('Signup error')));

      const result = await service.signup('John', 'john@example.com', 'pass', 'user');

      expect(result).toBeFalse();
    });
  });

  describe('logout', () => {
    it('should clear storage and navigate on logout', async () => {
      localStorage.setItem('refreshToken', 'some-token');
      authServiceSpy.logout.and.returnValue(of({ message: 'Logout successful' }));

      await service.logout();

      expect(storeSpy.dispatch).toHaveBeenCalledWith(clearState());
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
      expect(localStorage.getItem('refreshToken')).toBeNull();
    });

    it('should handle logout error', async () => {
      authServiceSpy.logout.and.returnValue(throwError(() => new Error('Logout error')));

      await service.logout();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh token and store it', async () => {
      const response = { accessToken: 'new.token.jwt' };
      authServiceSpy.refreshAccessToken.and.returnValue(of(response));
      spyOn(service as any, 'putInsideStorage');

      const result = await service.refreshAccessToken('refresh-token');

      expect(result).toBe('new.token.jwt');
      expect(localStorage.getItem('accessToken')).toBe('new.token.jwt');
      expect((service as any).putInsideStorage).toHaveBeenCalledWith('new.token.jwt');
    });

    it('should return null on refresh error', async () => {
      authServiceSpy.refreshAccessToken.and.returnValue(throwError(() => new Error('Error')));

      const result = await service.refreshAccessToken('invalid-token');

      expect(result).toBeNull();
    });
  });

  describe('isLoggedIn', () => {
    it('should return true if authState is valid', () => {
      localStorage.setItem('authState', JSON.stringify({ isAuthenticated: true }));
      const result = service.isLoggedIn();
      expect(result).toBeTrue();
    });

    it('should return false if authState is invalid or not set', () => {
      localStorage.removeItem('authState');
      expect(service.isLoggedIn()).toBeFalse();
    });
  });

  describe('decodeTokenPayload', () => {
    it('should decode JWT payload', () => {
      const payload = { id: '123', name: 'Test' };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;

      const result = service.decodeTokenPayload(token);
      expect(result).toEqual(payload);
    });

    it('should return null on invalid token', () => {
      const result = service.decodeTokenPayload('invalid.token');
      expect(result).toBeNull();
    });
  });

  describe('navigateToLogin', () => {
    it('should navigate to login page', () => {
      service.navigateToLogin();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
    });
  });
});
