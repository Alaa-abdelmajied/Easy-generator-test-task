import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoggerService } from '../common/logger/logger.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    _id: { toString: () => 'user123' },
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPass',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
            findById: jest.fn(),
            validatePassword: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('jwt-token') },
        },
        {
          provide: LoggerService,
          useValue: { log: jest.fn(), warn: jest.fn() },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  describe('signUp', () => {
    it('should create user and return token', async () => {
      usersService.create.mockResolvedValue(mockUser as any);

      const result = await authService.signUp({
        email: 'test@example.com',
        name: 'Test User',
        password: 'Password1!',
      });

      expect(result.accessToken).toBe('jwt-token');
      expect(result.user.email).toBe('test@example.com');
    });
  });

  describe('signIn', () => {
    it('should return token for valid credentials', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser as any);
      usersService.validatePassword.mockResolvedValue(true);

      const result = await authService.signIn({
        email: 'test@example.com',
        password: 'Password1!',
      });

      expect(result.accessToken).toBe('jwt-token');
    });

    it('should throw for invalid email', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(
        authService.signIn({ email: 'wrong@test.com', password: 'pass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw for wrong password', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser as any);
      usersService.validatePassword.mockResolvedValue(false);

      await expect(
        authService.signIn({ email: 'test@example.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    it('should return user if exists', async () => {
      usersService.findById.mockResolvedValue(mockUser as any);

      const result = await authService.validateUser('user123');
      expect(result.email).toBe('test@example.com');
    });

    it('should throw if user not found', async () => {
      usersService.findById.mockResolvedValue(null);

      await expect(authService.validateUser('badId')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
