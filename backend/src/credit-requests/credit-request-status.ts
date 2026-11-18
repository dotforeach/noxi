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
