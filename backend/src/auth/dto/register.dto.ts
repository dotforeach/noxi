import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail()
  email: string;

  // 72 bytes es el límite habitual de los algoritmos de hash de contraseñas.
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;
}
