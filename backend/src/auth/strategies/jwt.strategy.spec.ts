import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from '../auth.service';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('test-secret') },
        },
        {
          provide: AuthService,
          useValue: { validateUser: jest.fn() },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    authService = module.get(AuthService);
  });

  it('should validate and return user', async () => {
    const mockUser = { id: '123', email: 'test@test.com', name: 'Test' };
    authService.validateUser.mockResolvedValue(mockUser);

    const result = await strategy.validate({ sub: '123', email: 'test@test.com', name: 'Test' });

    expect(result).toEqual(mockUser);
  });

  it('should throw if user not found', async () => {
    authService.validateUser.mockResolvedValue(null as any);

    await expect(
      strategy.validate({ sub: '123', email: 'test@test.com', name: 'Test' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
