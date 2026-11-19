export type CreditRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export const AMOUNT_MIN = 500;
export const AMOUNT_MAX = 50_000;
export const TERM_MIN_MONTHS = 6;
export const TERM_MAX_MONTHS = 60;

/** Mismo formato que valida el backend: 8-123-456, PE-1-234, E-8-12345… */
export const CEDULA_PATTERN = /^(?:0?[1-9]|1[0-3]|E|N|PE|PI)-\d{1,4}-\d{1,6}$/i;
export const CEDULA_MAX_LENGTH = 20;

export interface CreditRequest {
  id: string;
  cedula: string;
  amount: number;
  termMonths: number;
  status: CreditRequestStatus;
  statusComment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCreditRequest {
  cedula: string;
  amount: number;
  termMonths: number;
}
