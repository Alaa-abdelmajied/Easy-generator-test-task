import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoggerService } from '../common/logger/logger.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockResponse = {
    accessToken: 'jwt-token',
    user: { id: 'user123', email: 'test@example.com', name: 'Test' },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: { signUp: jest.fn(), signIn: jest.fn() },
        },
        {
          provide: LoggerService,
          useValue: { log: jest.fn(), warn: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('signUp should call service and return result', async () => {
    authService.signUp.mockResolvedValue(mockResponse);

    const result = await controller.signUp({
      email: 'test@example.com',
      name: 'Test',
      password: 'Password1!',
    });

    expect(result).toEqual(mockResponse);
  });

  it('signIn should call service and return result', async () => {
    authService.signIn.mockResolvedValue(mockResponse);

    const result = await controller.signIn({
      email: 'test@example.com',
      password: 'Password1!',
    });

    expect(result).toEqual(mockResponse);
  });

  it('getProfile should return user from request', async () => {
    const mockReq = { user: { id: '123', email: 'test@example.com', name: 'Test' } };

    const result = await controller.getProfile(mockReq);

    expect(result).toEqual(mockReq.user);
  });
});
