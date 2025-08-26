import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

describe('Auth Service Test', () => {
  let authService: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'your-secret-key',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      providers: [AuthService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should login alice with admin role', async () => {
    const result = await authService.login({
      username: 'alice',
      password: 'password123',
    });

    expect(result.access_token).toBeDefined();
    expect(result.user.username).toBe('alice');
    expect(result.user.roles).toContain('admin');
    expect(result.user.roles).toContain('user');
  });

  it('should login bob with user role only', async () => {
    const result = await authService.login({
      username: 'bob',
      password: 'password123',
    });

    expect(result.access_token).toBeDefined();
    expect(result.user.username).toBe('bob');
    expect(result.user.roles).toContain('user');
    expect(result.user.roles).not.toContain('admin');
  });

  it('should reject invalid credentials', async () => {
    await expect(
      authService.login({
        username: 'alice',
        password: 'wrongpassword',
      })
    ).rejects.toThrow('Invalid credentials');
  });
});
