import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { extractErrorMessage } from '../../core/http-error';
import { AMOUNT_MAX, AMOUNT_MIN, TERM_MAX_MONTHS, TERM_MIN_MONTHS } from '../../core/models/credit-request';
import { CreditRequestsService } from '../../core/services/credit-requests.service';

@Component({
  selector: 'app-credit-request-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './credit-request-form.html',
})
export class CreditRequestForm {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly service = inject(CreditRequestsService);
  private readonly router = inject(Router);

  protected readonly limits = { AMOUNT_MIN, AMOUNT_MAX, TERM_MIN_MONTHS, TERM_MAX_MONTHS };
  protected readonly form = this.fb.group({
    cedula: ['', Validators.required],
    amount: [AMOUNT_MIN, [Validators.required, Validators.min(AMOUNT_MIN), Validators.max(AMOUNT_MAX)]],
    termMonths: [
      TERM_MIN_MONTHS,
      [Validators.required, Validators.min(TERM_MIN_MONTHS), Validators.max(TERM_MAX_MONTHS), Validators.pattern(/^\d+$/)],
    ],
  });
  protected readonly error = signal<string | null>(null);
  protected readonly loading = signal(false);

  protected submit() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    this.loading.set(true);
    this.error.set(null);
    this.service.create(this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/solicitudes']),
      error: (err) => {
        this.error.set(extractErrorMessage(err));
        this.loading.set(false);
      },
    });
  }
}
