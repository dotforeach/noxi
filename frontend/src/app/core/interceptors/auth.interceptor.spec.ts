import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let ctrl: HttpTestingController;

  beforeEach(() => {
    localStorage.setItem('noxi_token', 'abc');
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'login', children: [] }]), provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpClient);
    ctrl = TestBed.inject(HttpTestingController);
  });
  afterEach(() => localStorage.clear());

  it('agrega el header Authorization con el token', () => {
    http.get('/x').subscribe();
    const req = ctrl.expectOne('/x');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc');
    req.flush({});
  });

  it('cierra sesión ante un 401', () => {
    const auth = TestBed.inject(AuthService);
    http.get('/x').subscribe({ error: () => undefined });
    ctrl.expectOne('/x').flush({ message: 'Token inválido' }, { status: 401, statusText: 'Unauthorized' });
    expect(auth.isLoggedIn()).toBe(false);
  });
});
