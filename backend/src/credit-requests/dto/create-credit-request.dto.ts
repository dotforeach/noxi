import { IsInt, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { AMOUNT_MAX, AMOUNT_MIN, TERM_MAX_MONTHS, TERM_MIN_MONTHS } from '../credit-request-status.js';

export class CreateCreditRequestDto {
  @IsString()
  @IsNotEmpty()
  cedula: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(AMOUNT_MIN)
  @Max(AMOUNT_MAX)
  amount: number;

  @IsInt()
  @Min(TERM_MIN_MONTHS)
  @Max(TERM_MAX_MONTHS)
  termMonths: number;
}
