import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { CreditRequestsModule } from './credit-requests/credit-requests.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        uuidExtension: 'pgcrypto' as const,
        url: config.getOrThrow<string>('DATABASE_URL'),
        autoLoadEntities: true,
        // El esquema se gestiona solo con migraciones (src/migrations); se aplican al arrancar.
        synchronize: false,
        migrations: [new URL('./migrations/*.js', import.meta.url).pathname],
        migrationsRun: true,
      }),
    }),
    AuthModule,
    CreditRequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
