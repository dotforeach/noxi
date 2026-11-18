import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { extractErrorMessage } from '../../core/http-error';
import { CreditRequest, CreditRequestStatus } from '../../core/models/credit-request';
import { CreditRequestsService } from '../../core/services/credit-requests.service';

type Resolution = Exclude<CreditRequestStatus, 'PENDING'>;

@Component({
  selector: 'app-credit-request-list',
  imports: [CurrencyPipe, DatePipe, FormsModule, RouterLink],
  templateUrl: './credit-request-list.html',
  styleUrl: './credit-request-list.scss',
})
export class CreditRequestList implements OnInit {
  private readonly service = inject(CreditRequestsService);

  protected readonly statuses: { value: CreditRequestStatus | ''; label: string }[] = [
    { value: '', label: 'Todas' },
    { value: 'PENDING', label: 'Pendientes' },
    { value: 'APPROVED', label: 'Aprobadas' },
    { value: 'REJECTED', label: 'Rechazadas' },
  ];
  protected readonly labels: Record<CreditRequestStatus, string> = {
    PENDING: 'Pendiente',
    APPROVED: 'Aprobada',
    REJECTED: 'Rechazada',
  };

  protected readonly requests = signal<CreditRequest[]>([]);
  protected readonly filter = signal<CreditRequestStatus | ''>('');
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  /** Solicitud en proceso de resolución (se pide el comentario antes de confirmar). */
  protected readonly pending = signal<{ id: string; status: Resolution } | null>(null);
  protected comment = '';

  ngOnInit() {
    this.load();
  }

  protected setFilter(value: CreditRequestStatus | '') {
    this.filter.set(value);
    this.load();
  }

  protected startResolve(id: string, status: Resolution) {
    this.comment = '';
    this.error.set(null);
    this.pending.set({ id, status });
  }

  protected cancelResolve() {
    this.pending.set(null);
  }

  protected confirmResolve() {
    const p = this.pending();
    if (!p || !this.comment.trim()) return this.error.set('El comentario es obligatorio');
    this.service.changeStatus(p.id, p.status, this.comment.trim()).subscribe({
      next: () => {
        this.pending.set(null);
        this.load();
      },
      error: (err) => this.error.set(extractErrorMessage(err)),
    });
  }

  private load() {
    this.loading.set(true);
    this.error.set(null);
    this.service.list(this.filter() || undefined).subscribe({
      next: (data) => {
        this.requests.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(extractErrorMessage(err));
        this.loading.set(false);
      },
    });
  }
}
