import { Inject, Injectable, Logger, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashPassword, verifyPassword } from './password.js';
import { User } from './user.entity.js';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @Inject(JwtService) private readonly jwt: JwtService,
    @Inject(ConfigService) private readonly config: ConfigService,
  ) {}

  /** Crea el usuario inicial a partir de variables de entorno (nunca hay credenciales en el repo). */
  async onModuleInit() {
    const email = this.config.get<string>('ADMIN_EMAIL');
    const password = this.config.get<string>('ADMIN_PASSWORD');
    if (!email || !password) {
      this.logger.warn('ADMIN_EMAIL/ADMIN_PASSWORD no definidos: no se creó usuario inicial');
      return;
    }
    if (await this.users.existsBy({ email })) return;
    await this.users.save(this.users.create({ email, passwordHash: await hashPassword(password) }));
    this.logger.log(`Usuario inicial creado: ${email}`);
  }

  async login(email: string, password: string) {
    const user = await this.users.findOneBy({ email });
    // Mensaje genérico: no revela si el correo existe.
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const accessToken = await this.jwt.signAsync({ sub: user.id, email: user.email });
    return { accessToken };
  }
}
