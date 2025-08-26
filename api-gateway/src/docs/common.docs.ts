import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../dto/response.dto';

/**
 * Reusable decorator for JWT-protected endpoints.
 * Keeps controller methods concise while preserving full Swagger metadata.
 */
export function AuthenticatedEndpoint(
  summary: string,
  description: string,
  successType: any,
  tag = 'default',
  isArray = false,
) {
  return applyDecorators(
    ApiTags(tag),
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ summary, description }),
    ApiResponse({ status: 200, description: 'Success', type: successType, isArray }),
    ApiUnauthorizedResponse({ description: 'JWT token is missing or invalid', type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: 'User does not have required role', type: ErrorResponseDto }),
  );
}
