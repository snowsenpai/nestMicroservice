import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from '../auth/dto/login.dto';
import { LoginResponseDto } from '../auth/dto/auth-response.dto';
import { ErrorResponseDto } from '../dto/response.dto';

export function LoginEndpoint() {
  return applyDecorators(
    ApiOperation({ summary: 'User login', description: 'Authenticate user and return JWT token' }),
    ApiBody({ type: LoginDto }),
    ApiResponse({ status: 201, description: 'Login successful', type: LoginResponseDto }),
    ApiResponse({ status: 400, description: 'Validation error' }),
    ApiResponse({ status: 401, description: 'Invalid credentials', type: ErrorResponseDto }),
  );
}
