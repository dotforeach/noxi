import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashPassword, verifyPassword } from './password.js';
import { User } from './user.entity.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @Inject(JwtService) private readonly jwt: JwtService,
  ) {}

  async register(email: string, password: string) {
    if (await this.users.existsBy({ email })) {
      throw new ConflictException('Ya existe un usuario con ese correo');
    }
    const user = await this.users.save(
      this.users.create({ email, passwordHash: await hashPassword(password) }),
    );
    return this.issueToken(user);
  }

  async login(email: string, password: string) {
    const user = await this.users.findOneBy({ email });
    // Mensaje genérico: no revela si el correo existe.
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return this.issueToken(user);
  }

  private async issueToken(user: User) {
    return { accessToken: await this.jwt.signAsync({ sub: user.id, email: user.email }) };
  }
}
