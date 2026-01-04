import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService, AuthResponse, UserProfile } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async signUp(@Body() signUpDto: SignUpDto): Promise<AuthResponse> {
    return this.authService.signUp(signUpDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in an existing user' })
  @ApiResponse({ status: 200, description: 'User successfully signed in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async signIn(@Body() signInDto: SignInDto): Promise<AuthResponse> {
    return this.authService.signIn(signInDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile (protected endpoint)' })
  @ApiResponse({ status: 200, description: 'Returns user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req: { user: UserProfile }): Promise<UserProfile> {
    return req.user;
  }
}
