import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { API_URL } from '../api.config';

const TOKEN_KEY = 'noxi_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  readonly token = this._token.asReadonly();
  readonly isLoggedIn = computed(() => this._token() !== null);

  login(email: string, password: string) {
    return this.http
      .post<{ accessToken: string }>(`${API_URL}/auth/login`, { email, password })
      .pipe(tap(({ accessToken }) => this.setToken(accessToken)));
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this._token.set(null);
    this.router.navigate(['/login']);
  }

  private setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
    this._token.set(token);
  }
}
