import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '../api.config';
import { CreateCreditRequest, CreditRequest, CreditRequestStatus } from '../models/credit-request';

@Injectable({ providedIn: 'root' })
export class CreditRequestsService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/credit-requests`;

  create(body: CreateCreditRequest) {
    return this.http.post<CreditRequest>(this.url, body);
  }

  list(status?: CreditRequestStatus) {
    const params = status ? new HttpParams().set('status', status) : undefined;
    return this.http.get<CreditRequest[]>(this.url, { params });
  }

  changeStatus(id: string, status: Exclude<CreditRequestStatus, 'PENDING'>, comment: string) {
    return this.http.patch<CreditRequest>(`${this.url}/${id}/status`, { status, comment });
  }
}
