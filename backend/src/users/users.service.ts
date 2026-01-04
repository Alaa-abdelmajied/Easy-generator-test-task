import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { SignUpDto } from '../auth/dto/signup.dto';
import { LoggerService } from '../common/logger/logger.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private logger: LoggerService,
  ) {}

  async create(signUpDto: SignUpDto): Promise<UserDocument> {
    const { email, name, password } = signUpDto;

    const existingUser = await this.userModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      this.logger.warn(`Registration failed - email exists: ${email}`, 'UsersService');
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new this.userModel({
      email: email.toLowerCase(),
      name,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    this.logger.log(`New user created: ${email}`, 'UsersService');
    
    return savedUser;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() });
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
