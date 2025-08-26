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
export class OrderController {
  private orders = [
    { id: 101, item: 'Laptop', quantity: 1 },
    { id: 102, item: 'Phone', quantity: 2 },
  ];

  @MessagePattern({ cmd: 'get_orders' })
  getOrders(payload: RequestPayload) {
    // Defense in depth: Validate roles at microservice level
    if (!payload.user || !payload.user.roles.some(role => ['admin', 'user'].includes(role))) {
      throw new ForbiddenException('Access denied: Admin or User role required');
    }

    return {
      success: true,
      data: this.orders,
      requestedBy: payload.user.username,
    };
  }
}
