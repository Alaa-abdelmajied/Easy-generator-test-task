import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private logger: LoggerService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      const request = context.switchToHttp().getRequest();
      this.logger.warn(`Unauthorized access attempt: ${request.url}`, 'JwtAuthGuard');
      throw err || new UnauthorizedException('Access denied');
    }
    return user;
  }
}
