# Copilot Instructions for AI Coding Agents

## Big Picture Architecture
  - `api-gateway`: HTTP entry point (port 3000) that proxies to microservices via NATS
  - `user-service`: NATS microservice handling user data with `@MessagePattern({ cmd: 'get_users' })`
  - `order-service`: NATS microservice handling order data with `@MessagePattern({ cmd: 'get_orders' })`
  - Gateway: `npm --workspace api-gateway run start:dev`
  - User Service: `npm --workspace user-service run start:dev`
  - Order Service: `npm --workspace order-service run start:dev`

# Copilot Instructions for AI Coding Agents

Purpose: short, actionable guidance so an AI coding agent can be productive in this repo immediately.

## Big picture
- Monorepo with three NestJS services (root `package.json` defines workspaces):
  - `api-gateway` — HTTP entry (port 3000). Validates/authenticates requests, exposes Swagger, forwards commands over NATS.
  - `user-service` — NATS-only microservice (implements `@MessagePattern({ cmd: 'get_users' })`).
  - `order-service` — NATS-only microservice (implements `@MessagePattern({ cmd: 'get_orders' })`).

## Key integration & patterns (read these files)
- Gateway → microservices: `ClientProxy.send(pattern, payload)` + `firstValueFrom()` (see `api-gateway/src/app.controller.ts`).
- Message patterns are plain objects: `{ cmd: 'action_name' }`. Payloads commonly look like `{ user, data }`.
- DI tokens for clients: `USER_SERVICE`, `ORDER_SERVICE` (registered in `api-gateway/src/app.module.ts`).

## Swagger & docs (single source)
- All Swagger setup lives in `api-gateway/src/main.ts` (DocumentBuilder, tags: `auth`, `users`, `orders`, and `.addBearerAuth()` for JWT). UI: `/api-docs`, JSON: `/api-docs-json`.
- Controllers should use centralized docs in `api-gateway/src/docs/` (examples: `common.docs.ts`, `login.docs.ts`) via `applyDecorators()` — follow those examples when adding endpoints.

## Dev workflows / commands
- Start gateway only: `npm --workspace api-gateway run start:dev`
- Type-check gateway: `cd api-gateway && npx tsc -p tsconfig.json --noEmit`
- Run gateway and view Swagger: `cd api-gateway && npm run start` → `http://localhost:3000/api-docs`
- Prerequisite: NATS server at `localhost:4222` for full end-to-end runs.

## Code conventions & examples
- Keep microservices NATS-only (no HTTP handlers). If you change a message contract, update both caller and consumer.
- DTOs use `@ApiProperty()` for Swagger (see `api-gateway/src/dto/response.dto.ts`).
- Auth flow: validate JWT in gateway (Passport strategy & guards in `api-gateway/src/auth`), forward `user` in message payloads — microservices may re-check permissions.

## Safe-edit checklist for AI agents
1. Search for the message pattern string before changing a contract (e.g., `get_users`).
2. Prefer adding `*.docs.ts` under `api-gateway/src/docs/` for new Swagger metadata.
3. Run `npx tsc` in the workspace you edited and start the gateway to validate Swagger UI.

## Files to inspect first
- `api-gateway/src/main.ts` — app bootstrap and Swagger
- `api-gateway/src/app.module.ts` — client registration and modules
- `api-gateway/src/app.controller.ts` — example gateway → microservice calls
- `api-gateway/src/docs/` — pattern for centralized Swagger metadata
- `*/src/main.ts` in microservices — NATS bootstrap pattern

If anything above is ambiguous or you want decorator templates/examples added, say which area and I'll expand this file with concrete snippets.
