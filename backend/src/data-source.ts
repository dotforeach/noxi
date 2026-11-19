import { DataSource } from 'typeorm';

/**
 * DataSource usado por el CLI de TypeORM (migration:generate / run / revert).
 * La app en ejecución usa su propia configuración en app.module.ts.
 */
export default new DataSource({
  type: 'postgres',
  uuidExtension: 'pgcrypto', // gen_random_uuid() es nativo desde PostgreSQL 13
  url: process.env.DATABASE_URL,
  entities: [new URL('./**/*.entity.js', import.meta.url).pathname],
  migrations: [new URL('./migrations/*.js', import.meta.url).pathname],
});
