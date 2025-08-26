# Copilot Instructions for AI Coding Agents

## Big Picture Architecture
- **NestJS Microservices Monorepo**: Three services with NATS communication and workspace-based dependency management
  - `api-gateway`: HTTP entry point (port 3000) that proxies to microservices via NATS
  - `user-service`: NATS microservice handling user data with `@MessagePattern({ cmd: 'get_users' })`
  - `order-service`: NATS microservice handling order data with `@MessagePattern({ cmd: 'get_orders' })`
- **Communication Pattern**: Gateway uses `ClientProxy.send()` + `firstValueFrom()` to communicate with microservices

## Developer Workflows
- **Start All Services**: `npm run start:dev` (from root - uses npm-run-all to start all workspaces)
- **Individual Services**:
  - Gateway: `npm --workspace api-gateway run start:dev`
  - User Service: `npm --workspace user-service run start:dev`
  - Order Service: `npm --workspace order-service run start:dev`
- **Prerequisites**: NATS server must be running on `localhost:4222` before starting services
- **Testing**: Each service has Jest E2E config in `test/jest-e2e.json`

## Project-Specific Conventions
- **Workspace Structure**: Root `package.json` defines workspaces and cross-service scripts
- **NATS Message Patterns**: Use `{ cmd: 'action_name' }` objects for message routing
- **Service Ports**: Gateway on 3000, microservices are NATS-only (no HTTP)
- **Dependencies**: Each service has identical core deps (`@nestjs/microservices`, `nats`, `rxjs`)

## Critical Integration Points
- **NATS Dependency**: All services require `nats` package and connection to `localhost:4222`
- **Client Registration**: Gateway registers microservice clients in `AppModule.imports`
- **Message Handling**: Microservices use `@MessagePattern()` decorators, not HTTP routes
- **RxJS Patterns**: Gateway uses `firstValueFrom()` to convert observables to promises

## Auth Implementation Gaps (Ready for Development)
- Empty files exist for JWT strategy, DTOs, guards, and decorators
- Need to implement: `JwtAuthGuard`, `RolesGuard`, `@Roles()` decorator
- Auth flow: Gateway validates JWT → forwards to microservices with user context
- Microservices should double-check permissions (defense-in-depth pattern)

## Key Files to Understand
- `api-gateway/src/app.controller.ts`: Shows NATS client injection and `firstValueFrom` pattern
- `*/src/main.ts`: Different bootstrap patterns (HTTP vs NATS microservice)
- Root `package.json`: Workspace configuration and parallel start scripts
