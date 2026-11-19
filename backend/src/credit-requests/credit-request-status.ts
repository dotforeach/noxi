export const CREDIT_REQUEST_STATUSES = ['PENDING', 'APPROVED', 'REJECTED'] as const;
export type CreditRequestStatus = (typeof CREDIT_REQUEST_STATUSES)[number];

/** Una solicitud solo puede resolverse desde PENDING; APPROVED/REJECTED son finales. */
export const ALLOWED_TRANSITIONS: Record<CreditRequestStatus, readonly CreditRequestStatus[]> = {
  PENDING: ['APPROVED', 'REJECTED'],
  APPROVED: [],
  REJECTED: [],
};

// Reglas de negocio del reto
export const AMOUNT_MIN = 500;
export const AMOUNT_MAX = 50_000;
export const TERM_MIN_MONTHS = 6;
export const TERM_MAX_MONTHS = 60;

/**
 * Cédula panameña: provincia (1-13), o prefijo E (extranjero), N (naturalizado),
 * PE (panameño nacido en el extranjero) o PI (indígena); luego tomo y asiento.
 * Ejemplos: 8-123-456, 08-0123-004567, E-8-12345, PE-1-234.
 */
export const CEDULA_PATTERN = /^(?:0?[1-9]|1[0-3]|E|N|PE|PI)-\d{1,4}-\d{1,6}$/;
export const CEDULA_MAX_LENGTH = 20;
