# Swagger/OpenAPI Documentation - API Gateway

This document describes the Swagger/OpenAPI implementation for the API Gateway service in the NestJS microservices monorepo.

## Overview

The API Gateway now includes comprehensive Swagger documentation that documents all HTTP endpoints exposed by the gateway. The documentation is available at:

- **Swagger UI**: <http://localhost:3000/api-docs>
- **JSON Schema**: <http://localhost:3000/api-docs-json>

## Features Implemented

### 1. Swagger Configuration

- **Title**: "API Gateway"
- **Description**: "HTTP entry point for User and Order microservices"
- **Version**: "1.0"
- **Tags**: "auth", "users", "orders"
- **Bearer Authentication**: JWT-based authentication with security schemes

### 2. Endpoint Documentation

#### Authentication Endpoints

- `POST /login` - User authentication with username/password
- Returns JWT token and user information
- Comprehensive validation with class-validator decorators

#### User Endpoints

- `GET /users` - Retrieve all users (Admin only)
- Requires JWT authentication and admin role
- Proxies to user-service via NATS

#### Order Endpoints

- `GET /orders` - Retrieve all orders (Admin and User roles)
- Requires JWT authentication with admin or user role
- Proxies to order-service via NATS

### 3. DTOs and Validation

- **LoginDto**: Input validation for authentication
- **LoginResponseDto**: Structured response for login endpoint
- **UserDto**: User data structure documentation
- **OrderDto**: Order data structure documentation
- **ErrorResponseDto**: Standard error response format

### 4. Security Documentation

- JWT Bearer token authentication
- Role-based access control (RBAC)
- Detailed error responses for unauthorized/forbidden access

## Dependencies Added

```json
{
  "@nestjs/swagger": "^7.x.x",
  "swagger-ui-express": "^5.x.x",
  "class-validator": "^0.14.x",
  "class-transformer": "^0.5.x"
}
```

## Implementation Notes

1. **Microservice Isolation**: Swagger is only implemented on the API Gateway, not on the NATS-only microservices (user-service, order-service).

2. **Gateway Pattern**: Documentation reflects the actual HTTP endpoints exposed by the gateway, not the internal NATS message patterns.

3. **JWT Integration**: Swagger UI includes a "Authorize" button for testing authenticated endpoints.

4. **Response Examples**: All endpoints include realistic response examples and error scenarios.

5. **Validation**: Input DTOs include comprehensive validation rules that are reflected in the documentation.

## Usage

1. Start the API Gateway: `npm run start:dev`
2. Navigate to <http://localhost:3000/api-docs>
3. Use the "Authorize" button to test JWT-protected endpoints
4. Test endpoints directly from the Swagger UI

## Architecture Compliance

This implementation follows the project's architectural patterns:

- ✅ Swagger only on HTTP-facing gateway service
- ✅ No impact on NATS microservice communication
- ✅ Preserves existing RBAC and JWT authentication
- ✅ Documents actual HTTP API surface, not internal message patterns
- ✅ Maintains separation of concerns between gateway and microservices
