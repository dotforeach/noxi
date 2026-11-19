import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail()
  email: string;

  // Se admiten letras, números y cualquier carácter especial; el hash (scrypt) no limita la longitud.
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;
}
