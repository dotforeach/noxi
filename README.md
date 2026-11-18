# Noxi — Gestión de solicitudes de crédito

- **Nombre completo:** MarcOS P1n3d4
- **Correo:** lc.mpineda@gmail.com
- **Usuario de GitHub:** dotforeach

Aplicación full stack para crear solicitudes de crédito, aprobarlas o rechazarlas (con comentario) y consultar su estado filtrando por estado.

## Tecnologías
| Capa | Tecnología |
|---|---|
| Backend | NestJS 12, TypeORM, class-validator, JWT (`@nestjs/jwt`) |
| Base de datos | PostgreSQL 16 |
| Frontend | Angular 22 (standalone, signals, formularios reactivos) |
| Infraestructura | Docker / docker compose |
| Tests | Vitest (backend y frontend) |

## Estructura
```
backend/              API REST (NestJS)
frontend/             SPA (Angular)
docker-compose.yml    db + backend + frontend
```

## Ejecutar con Docker
Requiere los puertos 3000 (API) y 4200 (web) libres.
```bash
cp .env.example .env      # completar todas las variables (ver tabla)
docker compose up --build
```
- Web: http://localhost:4200 (iniciar sesión con `ADMIN_EMAIL` / `ADMIN_PASSWORD`)
- API: http://localhost:3000/api

| Variable | Descripción |
|---|---|
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | Credenciales de la base de datos que levanta el compose |
| `JWT_SECRET` | Secreto para firmar los JWT |
| `JWT_EXPIRES_IN` | Vigencia del token (por defecto `1h`) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Usuario inicial; se crea al arrancar el backend si no existe |

No hay credenciales en el repositorio: todo sale del `.env`, ignorado por git. La base de datos es un PostgreSQL local en Docker y las tablas se crean al iniciar (`synchronize`, solo para este reto; en producción irían migraciones). Para usar Supabase u otro Postgres, apuntar `DATABASE_URL` del backend a esa instancia.

## Desarrollo local (sin Docker)
Si la API no corre en `http://localhost:3000`, cambiar `frontend/src/app/core/api.config.ts`.
```bash
# Backend (necesita un Postgres propio)
cd backend
cp .env.example .env      # completar DATABASE_URL, JWT_SECRET, ADMIN_*
npm install --legacy-peer-deps
npm run start:dev

# Frontend
cd frontend
npm install
npm start                 # http://localhost:4200
```
`--legacy-peer-deps` evita un fallo de resolución de dependencias de npm con NestJS 12.

## Tests
```bash
cd backend  && npm test
cd frontend && npm test -- --watch=false
```

## API
Todas las rutas (salvo login) requieren `Authorization: Bearer <token>`.

| Método y ruta | Descripción | Códigos |
|---|---|---|
| `POST /api/auth/login` | `{email, password}` → `{accessToken}` | 200, 400, 401 |
| `POST /api/credit-requests` | `{cedula, amount, termMonths}` | 201, 400, 401 |
| `GET /api/credit-requests?status=` | Lista; `status` = `PENDING`, `APPROVED` o `REJECTED` | 200, 400, 401 |
| `GET /api/credit-requests/:id` | Detalle | 200, 400, 401, 404 |
| `PATCH /api/credit-requests/:id/status` | `{status, comment}` (comentario obligatorio) | 200, 400, 401, 404, 409 |

Reglas de negocio: monto entre $500 y $50,000; plazo entero entre 6 y 60 meses. Una solicitud solo se puede resolver desde `PENDING`; intentar cambiar una ya aprobada o rechazada devuelve 409.

## Decisiones de diseño
- **Errores**: la API responde `{message, error, statusCode}` y el frontend muestra el `message` tal cual al usuario (validaciones, 409, sin conexión).
- **Contraseñas**: `scrypt` de Node con sal aleatoria y comparación en tiempo constante (sin dependencias nativas).
- **Login**: mismo error para correo o contraseña incorrectos, para no revelar qué usuarios existen.
- **Transiciones de estado** definidas en un solo lugar (`ALLOWED_TRANSITIONS`).
- **Sesión en el frontend**: el JWT se guarda en `localStorage`; un interceptor lo adjunta y cierra sesión ante un 401.
- **Validación doble**: el formulario replica los rangos del backend para dar feedback inmediato; el backend es la fuente de verdad.
