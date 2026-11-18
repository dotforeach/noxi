import { HttpErrorResponse } from '@angular/common/http';

/** Convierte cualquier error de la API en un texto legible para el usuario. */
export function extractErrorMessage(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0) return 'No se pudo conectar con el servidor';
    const message = err.error?.message;
    if (Array.isArray(message)) return message.join('. ');
    if (typeof message === 'string') return message;
    return `Error ${err.status}: ${err.statusText}`;
  }
  return 'Ocurrió un error inesperado';
}
