import { Controller, Get, Post, Body, Inject, UseGuards, Request } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { LoginDto } from './auth/dto/login.dto';
import { LoginResponseDto } from './auth/dto/auth-response.dto';
import { UserDto, OrderDto, ErrorResponseDto } from './dto/response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { JwtPayload } from './auth/interfaces/auth.interface';
import { LoginEndpoint } from './docs/login.docs';
import { AuthenticatedEndpoint } from './docs/common.docs';

@ApiTags('auth')
@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    @Inject('ORDER_SERVICE') private readonly orderClient: ClientProxy,
  ) {}

  @Post('login')
  @ApiTags('auth')
  @LoginEndpoint()
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @AuthenticatedEndpoint('Get all users', 'Retrieve all users from the user service (Admin only)', UserDto, 'users', true)
  async getUsers(@Request() req: { user: JwtPayload }) {
    return firstValueFrom(
      this.userClient.send(
        { cmd: 'get_users' },
        { user: req.user, data: {} }
      )
    );
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  @AuthenticatedEndpoint(
    'Get all orders',
    'Retrieve all orders from the order service (Admin and User roles)',
    OrderDto,
    'orders',
    true,
  )
  async getOrders(@Request() req: { user: JwtPayload }) {
    return firstValueFrom(
      this.orderClient.send(
        { cmd: 'get_orders' },
        { user: req.user, data: {} }
      )
    );
  }
}
