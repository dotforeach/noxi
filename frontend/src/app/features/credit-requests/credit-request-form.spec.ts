import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CreditRequestForm } from './credit-request-form';

describe('CreditRequestForm', () => {
  const form = () => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()] });
    return TestBed.createComponent(CreditRequestForm).componentInstance['form'];
  };

  it.each(['8-123-456', '08-0123-004567', 'PE-1-234', 'e-8-12345', 'N-12-345'])('acepta la cédula %s', (cedula) => {
    const f = form();
    f.controls.cedula.setValue(cedula);
    expect(f.controls.cedula.valid).toBe(true);
  });

  it.each(['', '<script>', '81234456', '14-123-456', '8-' + '1'.repeat(30)])('rechaza la cédula %j', (cedula) => {
    const f = form();
    f.controls.cedula.setValue(cedula);
    expect(f.controls.cedula.valid).toBe(false);
  });

  it.each([[499, false], [500, true], [50000, true], [50001, false]])('monto %d válido=%s', (amount, ok) => {
    const f = form();
    f.controls.amount.setValue(amount);
    expect(f.controls.amount.valid).toBe(ok);
  });

  it.each([[5, false], [6, true], [60, true], [61, false], [12.5, false]])('plazo %d válido=%s', (term, ok) => {
    const f = form();
    f.controls.termMonths.setValue(term);
    expect(f.controls.termMonths.valid).toBe(ok);
  });
});
