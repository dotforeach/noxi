import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { CREDIT_REQUEST_STATUSES, type CreditRequestStatus } from '../credit-request-status.js';

export class ListCreditRequestsDto {
  @ApiPropertyOptional({ enum: ['PENDING', 'APPROVED', 'REJECTED'] })
  @IsOptional()
  @IsIn(CREDIT_REQUEST_STATUSES)
  status?: CreditRequestStatus;
}
