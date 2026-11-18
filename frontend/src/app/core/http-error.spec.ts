import { HttpErrorResponse } from '@angular/common/http';
import { extractErrorMessage } from './http-error';

describe('extractErrorMessage', () => {
  it('une los mensajes de validación del backend', () => {
    const err = new HttpErrorResponse({ status: 400, error: { message: ['amount must not be less than 500', 'x'] } });
    expect(extractErrorMessage(err)).toBe('amount must not be less than 500. x');
  });

  it('devuelve el mensaje de texto del backend (p. ej. 409)', () => {
    const err = new HttpErrorResponse({ status: 409, error: { message: 'No se puede cambiar' } });
    expect(extractErrorMessage(err)).toBe('No se puede cambiar');
  });

  it('indica falta de conexión con status 0', () => {
    expect(extractErrorMessage(new HttpErrorResponse({ status: 0 }))).toContain('conectar');
  });
});
