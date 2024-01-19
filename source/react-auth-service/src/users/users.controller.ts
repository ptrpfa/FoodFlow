import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  UsersServiceController,
  UsersServiceControllerMethods,
  CreateUserDto,
  FindOneUserDto,
  UpdateUserDto,
  LoginRequest,
  LoginResponse,
} from 'proto/auth';

@Controller()
@UsersServiceControllerMethods()
export class UsersController implements UsersServiceController {
  constructor(private readonly usersService: UsersService) {}

  async createUser(CreateUserDto: CreateUserDto) {
    return this.usersService.create(CreateUserDto);
  }

  async findAllUsers() {
    return this.usersService.findAll();
  }

  async findOneUser(FindOneUserDto: FindOneUserDto) {
    return this.usersService.findOne({
      UserID: FindOneUserDto.UserID,
    });
  }

  async updateUser(UpdateUserDto: UpdateUserDto) {
    return this.usersService.update(
      { UserID: UpdateUserDto.UserID },
      UpdateUserDto,
    );
  }

  async removeUser(FindOneUserDto: FindOneUserDto) {
    return this.usersService.remove({
      UserID: FindOneUserDto.UserID,
    });
  }

  async login(LoginRequest: LoginRequest): Promise<LoginResponse> {
    return this.usersService.validateUser(
      LoginRequest.Username,
      LoginRequest.Password,
    );
  }
}
