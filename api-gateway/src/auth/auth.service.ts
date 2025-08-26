import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtPayload, User } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  // Demo users - in production, use a database
  private readonly users: User[] = [
    {
      id: '123',
      username: 'alice',
      password: 'password123', // For demo purposes - in production, hash these
      roles: ['admin', 'user'],
    },
    {
      id: '456',
      username: 'bob',
      password: 'password123', // For demo purposes - in production, hash these
      roles: ['user'],
    },
  ];

  constructor(private jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = this.users.find((u) => u.username === username);
    // For demo purposes, using plain text comparison
    // In production, use: if (user && await bcrypt.compare(password, user.password))
    if (user && password === user.password) {
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      roles: user.roles,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        roles: user.roles,
      },
    };
  }
}
