import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoggerService } from '../logger/logger.service';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let logger: jest.Mocked<LoggerService>;

  const mockContext = {
    switchToHttp: () => ({
      getRequest: () => ({ url: '/test' }),
    }),
  } as ExecutionContext;

  beforeEach(() => {
    logger = { log: jest.fn(), warn: jest.fn(), error: jest.fn() } as any;
    guard = new JwtAuthGuard(logger);
  });

  it('should return user if valid', () => {
    const user = { id: '123', email: 'test@test.com' };
    const result = guard.handleRequest(null, user, null, mockContext);
    expect(result).toEqual(user);
  });

  it('should throw and log if no user', () => {
    expect(() => guard.handleRequest(null, null, null, mockContext)).toThrow(
      UnauthorizedException,
    );
    expect(logger.warn).toHaveBeenCalled();
  });

  it('should throw original error if provided', () => {
    const error = new Error('test error');
    expect(() => guard.handleRequest(error, null, null, mockContext)).toThrow(error);
  });
});
