import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { LoggerService } from '../common/logger/logger.service';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: any;

  const mockUser = {
    _id: { toString: () => 'user123' },
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPass',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: { log: jest.fn(), warn: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get(getModelToken(User.name));
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      userModel.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('Test@Example.com');

      expect(userModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(result).toEqual(mockUser);
    });

    it('should return null if not found', async () => {
      userModel.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('notfound@test.com');
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      userModel.findById.mockResolvedValue(mockUser);

      const result = await service.findById('user123');
      expect(result).toEqual(mockUser);
    });
  });

  describe('create', () => {
    it('should throw if email already exists', async () => {
      userModel.findOne.mockResolvedValue(mockUser);

      await expect(
        service.create({
          email: 'test@example.com',
          name: 'Test',
          password: 'Password1!',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
