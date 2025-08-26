import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '1',
  })
  id: string;

  @ApiProperty({
    description: 'Username',
    example: 'admin',
  })
  username: string;

  @ApiProperty({
    description: 'User roles',
    example: ['admin'],
    type: [String],
  })
  roles: string[];
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'User information',
    type: UserResponseDto,
  })
  user: UserResponseDto;
}
