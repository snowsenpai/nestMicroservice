import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'User ID',
    example: '1',
  })
  id: string;

  @ApiProperty({
    description: 'Username',
    example: 'john_doe',
  })
  username: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User roles',
    example: ['user'],
    type: [String],
  })
  roles: string[];

  @ApiProperty({
    description: 'User creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: string;
}

export class OrderDto {
  @ApiProperty({
    description: 'Order ID',
    example: '1',
  })
  id: string;

  @ApiProperty({
    description: 'User ID who placed the order',
    example: '1',
  })
  userId: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Laptop',
  })
  productName: string;

  @ApiProperty({
    description: 'Quantity ordered',
    example: 1,
  })
  quantity: number;

  @ApiProperty({
    description: 'Order price',
    example: 999.99,
  })
  price: number;

  @ApiProperty({
    description: 'Order status',
    example: 'pending',
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
  })
  status: string;

  @ApiProperty({
    description: 'Order creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: string;
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 401,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Unauthorized',
  })
  message: string;

  @ApiProperty({
    description: 'Error type',
    example: 'Unauthorized',
    required: false,
  })
  error?: string;
}
