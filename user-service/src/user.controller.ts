import { Controller, ForbiddenException } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

interface RequestPayload {
  user: {
    sub: string;
    username: string;
    roles: string[];
  };
  data: any;
}

@Controller()
export class UserController {
  private users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ];

  @MessagePattern({ cmd: 'get_users' })
  getUsers(payload: RequestPayload) {
    // Defense in depth: Validate roles at microservice level
    if (!payload.user || !payload.user.roles.includes('admin')) {
      throw new ForbiddenException('Access denied: Admin role required');
    }

    return {
      success: true,
      data: this.users,
      requestedBy: payload.user.username,
    };
  }
}
