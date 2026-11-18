export type CreditRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export const AMOUNT_MIN = 500;
export const AMOUNT_MAX = 50_000;
export const TERM_MIN_MONTHS = 6;
export const TERM_MAX_MONTHS = 60;

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
