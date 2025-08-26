# RBAC Testing Guide

## Start the system

1. **Start NATS server** (required dependency):

   ```bash
   # Install NATS server if not already installed
   # On Windows with Chocolatey: choco install nats-server
   # Or download from: https://nats.io/download/
   nats-server
   ```

2. **Start all services**:

   ```bash
   npm run start:dev
   ```

## Test the RBAC system

### 1. Login as Alice (admin)

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "password": "password123"}'
```

Expected response:

```json
{
  "access_token": "eyJ...",
  "user": {
    "id": "123",
    "username": "alice",
    "roles": ["admin", "user"]
  }
}
```

### 2. Login as Bob (user)

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "bob", "password": "password123"}'
```

### 3. Test Alice access (should work for both)

```bash
# Get token from login response and use it
export ALICE_TOKEN="your_alice_token_here"

# Test /users (admin only) - should work
curl -H "Authorization: Bearer $ALICE_TOKEN" http://localhost:3000/users

# Test /orders (admin or user) - should work
curl -H "Authorization: Bearer $ALICE_TOKEN" http://localhost:3000/orders
```

### 4. Test Bob access (should only work for orders)

```bash
# Get token from login response and use it
export BOB_TOKEN="your_bob_token_here"

# Test /users (admin only) - should get 403 Forbidden
curl -H "Authorization: Bearer $BOB_TOKEN" http://localhost:3000/users

# Test /orders (admin or user) - should work
curl -H "Authorization: Bearer $BOB_TOKEN" http://localhost:3000/orders
```

### 5. Test without token (should get 401 Unauthorized)

```bash
curl http://localhost:3000/users
curl http://localhost:3000/orders
```

## Expected Behaviors

- **Alice (admin)**: Can access both `/users` and `/orders`
- **Bob (user)**: Can access `/orders` but gets 403 on `/users`
- **No token**: Gets 401 Unauthorized on both endpoints
- **Invalid token**: Gets 401 Unauthorized

## Defense in Depth

The system implements RBAC at two levels:

1. **API Gateway**: Validates JWT and checks roles before forwarding to microservices
2. **Microservices**: Double-check roles from the forwarded JWT payload

This ensures security even if the gateway is compromised or bypassed.
