import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { CREDIT_REQUEST_STATUSES, type CreditRequestStatus } from '../credit-request-status.js';

export class UpdateStatusDto {
  @IsIn(CREDIT_REQUEST_STATUSES)
  status: CreditRequestStatus;

  @IsString()
  @IsNotEmpty()
  comment: string;
}
