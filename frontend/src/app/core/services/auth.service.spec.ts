import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { API_URL } from '../api.config';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let auth: AuthService;
  let ctrl: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'login', children: [] }]), provideHttpClient(), provideHttpClientTesting()],
    });
    auth = TestBed.inject(AuthService);
    ctrl = TestBed.inject(HttpTestingController);
  });

  it('register guarda el token y marca la sesión como iniciada', () => {
    auth.register('a@b.com', 'secreto-123').subscribe();
    const req = ctrl.expectOne(`${API_URL}/auth/register`);
    expect(req.request.body).toEqual({ email: 'a@b.com', password: 'secreto-123' });
    req.flush({ accessToken: 'tok' });
    expect(auth.isLoggedIn()).toBe(true);
    expect(localStorage.getItem('noxi_token')).toBe('tok');
  });

  it('logout limpia el token', () => {
    localStorage.setItem('noxi_token', 'tok');
    auth.logout();
    expect(localStorage.getItem('noxi_token')).toBeNull();
  });
});
