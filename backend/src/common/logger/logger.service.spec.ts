import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let logger: LoggerService;

  beforeEach(() => {
    logger = new LoggerService();
  });

  it('should log info messages', () => {
    expect(() => logger.log('test message', 'TestContext')).not.toThrow();
  });

  it('should log warnings', () => {
    expect(() => logger.warn('warning', 'TestContext')).not.toThrow();
  });

  it('should log errors', () => {
    expect(() => logger.error('error', 'stack', 'TestContext')).not.toThrow();
  });
});
