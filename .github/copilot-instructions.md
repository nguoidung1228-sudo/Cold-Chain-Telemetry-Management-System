# Copilot Instructions for Cold-Chain Telemetry Management System

## Project Overview

This is a monorepo containing a **NestJS backend** for a Cold-Chain Telemetry Management System (alongside frontend and simulator components). The backend implements device telemetry management with PostgreSQL as the database.

---

## Build, Test & Lint Commands

All commands are run from the `backend/` directory.

### Building
- **Build for production**: `npm run build` → Output in `dist/`
- **Clean rebuild**: Delete `dist/` folder first, then `npm run build`

### Running the Application
- **Development (watch mode)**: `npm run start:dev` → Auto-restarts on file changes
- **Production**: `npm run start:prod` → Runs compiled `dist/main.js`
- **Debug mode**: `npm run start:debug` → Launches with Node debugger on port 9229

### Testing
- **Single unit test**: `npm run test -- devices.service.spec.ts`
- **All unit tests**: `npm run test`
- **Watch mode**: `npm run test:watch` → Re-runs tests on file changes
- **Coverage report**: `npm run test:cov` → Generates HTML report in `coverage/`
- **E2E tests**: `npm run test:e2e` → Runs integration tests against full application

### Code Quality
- **Lint with auto-fix**: `npm run lint` → Runs ESLint and auto-fixes issues
- **Format code**: `npm run format` → Applies Prettier formatting

### Database
- PostgreSQL runs on `localhost:5432`
- Database: `cold_chain_db`
- Credentials: username=`postgres`, password=`20102006` (see `app.module.ts`)
- TypeORM synchronization is **disabled** (`synchronize: false`) — migrations/DDL must be manual

---

## High-Level Architecture

### Modular Structure
The backend follows NestJS's modular architecture:
- **`src/app.module.ts`** — Root module that imports TypeOrmModule and feature modules
- **`src/devices/`** — Device telemetry feature module
  - `devices.module.ts` — Declares controller, service, and TypeORM repository
  - `devices.controller.ts` — HTTP endpoints (e.g., `GET /devices`)
  - `devices.service.ts` — Business logic, database queries via TypeOrmRepository
- **`src/device/`** — Database entities
  - `device.entity.ts` — Device TypeORM entity with decorators (id, device_code, device_name, device_type, status, created_at)

### Dependency Injection Pattern
- Services are injected via constructor parameters with `@InjectRepository()` decorator
- Controllers depend on services via constructor injection
- No manual service instantiation — NestJS handles wiring

### Database Layer
- **ORM**: TypeORM 1.1.0
- **Driver**: PostgreSQL (pg)
- **Autoload Entities**: Enabled in `app.module.ts` → Auto-discovers `@Entity` classes
- **Synchronize**: Disabled → DB schema changes require explicit migrations (not implemented in codebase yet)

### HTTP Server
- **Framework**: Express (via `@nestjs/platform-express`)
- **Port**: `process.env.PORT` or default `3000`
- **Bootstrapping**: `main.ts` creates NestApplication, initializes AppModule, starts listener

---

## Key Conventions

### File Organization
- **`*.entity.ts`** → TypeORM entity definitions
- **`*.service.ts`** → Business logic and data access
- **`*.controller.ts`** → HTTP route handlers
- **`*.module.ts`** → Module definition (imports, controllers, providers)
- **`*.spec.ts`** → Unit tests (Jest + ts-jest)
- **`test/`** → E2E test files (separate from src/)

### TypeORM Patterns
- Entities use decorators: `@Entity`, `@PrimaryGeneratedColumn`, `@Column`, `@CreateDateColumn`
- Services use `@InjectRepository(Entity)` to get a TypeORM `Repository<T>`
- Queries use standard TypeORM methods: `.find()`, `.findOne()`, `.save()`, `.remove()`

### NestJS Controller Patterns
- Use `@Controller('route')` class decorator to define base route
- Use HTTP method decorators: `@Get()`, `@Post()`, `@Patch()`, `@Delete()`
- Inject dependencies in constructor, use `this.` to access

### Testing
- **Unit tests**: Mock repositories and services; test controller and service logic independently
- **E2E tests**: Import full `AppModule` and test HTTP endpoints through the application
- **Test utilities**: Use `Test.createTestingModule()` for unit tests and `supertest` for HTTP assertions
- **Jest config**: `moduleFileExtensions: ['js', 'json', 'ts']`, `rootDir: src`, `testRegex: '.*\\.spec\\.ts$'`

### Code Style & Linting
- **Prettier** — Single quotes, trailing commas on all parameters
- **ESLint** — TypeScript strict mode, uses typescript-eslint plugin
- **Custom rules** (in `.eslintrc.mjs`):
  - `@typescript-eslint/no-explicit-any` → Off (flexible typing)
  - `@typescript-eslint/no-floating-promises` → Warn
  - `prettier/prettier` → Error with `endOfLine: "auto"`

### TypeScript Configuration
- **Target**: ES2023
- **Strict checks**: `strictNullChecks: true`, `noImplicitAny: false`
- **Module resolution**: nodenext (Node 18+ ESM support)
- **Emit metadata**: `emitDecoratorMetadata: true`, `experimentalDecorators: true` (required for NestJS/TypeORM)

---

## Common Workflows

### Adding a New Feature Module
1. Create `src/feature-name/` directory
2. Add `*.entity.ts` in a sibling or subfolder (e.g., `src/entities/feature-name.entity.ts`)
3. Create `feature-name.module.ts` with `@Module`, import `TypeOrmModule.forFeature([Entity])`
4. Create `feature-name.service.ts` with `@InjectRepository(Entity)` constructor parameter
5. Create `feature-name.controller.ts` with HTTP routes
6. Import the module in `app.module.ts` in the `imports` array

### Running a Single Unit Test File
```bash
npm run test -- devices.service.spec.ts
```

### Debugging
- Use `npm run start:debug` to start with debugger
- Browser DevTools or VS Code debugger will attach to localhost:9229
- Or add breakpoints in IDE and run `npm run test:debug` for Jest debugging

### Database Inspection
- Query `cold_chain_db` on `localhost:5432` using psql or GUI tool
- Ensure database exists and is initialized (schema not auto-sync'd)

---

## Important Notes

- **Database synchronization is disabled** — If you add/modify `@Entity` decorators, manually update the database schema
- **Hardcoded credentials** — Database config is in `app.module.ts` (should use `.env` in production)
- **No global error handling** — Controllers return raw results; consider adding exception filters for production
- **Limited test coverage** — Currently only e2e app test; add unit tests as features grow
