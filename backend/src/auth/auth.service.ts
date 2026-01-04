import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { LoggerService } from '../common/logger/logger.service';

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  user: UserProfile;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private logger: LoggerService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<AuthResponse> {
    const user = await this.usersService.create(signUpDto);
    
    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
    };

    const accessToken = this.jwtService.sign(payload);
    this.logger.log(`User registered: ${user.email}`, 'AuthService');

    return {
      accessToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    };
  }

  async signIn(signInDto: SignInDto): Promise<AuthResponse> {
    const { email, password } = signInDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      this.logger.warn(`Login failed - user not found: ${email}`, 'AuthService');
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await this.usersService.validatePassword(password, user.password);
    if (!isValid) {
      this.logger.warn(`Login failed - wrong password: ${email}`, 'AuthService');
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
    };

    const accessToken = this.jwtService.sign(payload);
    this.logger.log(`User logged in: ${user.email}`, 'AuthService');

    return {
      accessToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    };
  }

  async validateUser(userId: string): Promise<UserProfile> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    };
  }
}
