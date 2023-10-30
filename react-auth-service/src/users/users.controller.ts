import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  UsersServiceController,
  UsersServiceControllerMethods,
  CreateUserDto,
  FindOneUserDto,
  UpdateUserDto,
  ProtoUser,
  Users,
  LoginRequest,
  LoginResponse,
} from 'proto/auth';

@Controller()
@UsersServiceControllerMethods()
export class UsersController implements UsersServiceController {
  constructor(private readonly usersService: UsersService) {}

  async createUser(CreateUserDto: CreateUserDto) {
    const user = await this.usersService.create(CreateUserDto);
    const protoUser: ProtoUser = {
      UserID: user.UserID,
      Username: user.Username,
      FirstName: user.FirstName,
      LastName: user.LastName,
      Role: user.Role,
      DOB: user.DOB.toDateString(),
      AddressFirst: user.AddressFirst,
      AddressSecond: user.AddressSecond,
      AddressThird: user.AddressThird,
      PostalCode: user.PostalCode,
      Email: user.Email,
    };

    return protoUser;
  }

  async findAllUsers() {
    const users = await this.usersService.findAll();

    // Transform users to match ProtoUser structure
    const protoUsers: ProtoUser[] = users.map((user) => ({
      UserID: user.UserID,
      Username: user.Username,
      FirstName: user.FirstName,
      LastName: user.LastName,
      Role: user.Role,
      DOB: user.DOB.toDateString(),
      AddressFirst: user.AddressFirst,
      AddressSecond: user.AddressSecond,
      AddressThird: user.AddressThird,
      PostalCode: user.PostalCode,
      Email: user.Email,
    }));

    const usersResponse: Users = {
      users: protoUsers,
    };

    return usersResponse;
  }

  async findOneUser(FindOneUserDto: FindOneUserDto) {
    const user = await this.usersService.findOne({
      UserID: FindOneUserDto.UserID,
    });

    const protoUser: ProtoUser = {
      UserID: user.UserID,
      Username: user.Username,
      FirstName: user.FirstName,
      LastName: user.LastName,
      Role: user.Role,
      DOB: user.DOB.toDateString(),
      AddressFirst: user.AddressFirst,
      AddressSecond: user.AddressSecond,
      AddressThird: user.AddressThird,
      PostalCode: user.PostalCode,
      Email: user.Email,
    };

    return protoUser;
  }

  async updateUser(UpdateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(
      { UserID: UpdateUserDto.UserID },
      UpdateUserDto,
    );

    const protoUser: ProtoUser = {
      UserID: user.UserID,
      Username: user.Username,
      FirstName: user.FirstName,
      LastName: user.LastName,
      Role: user.Role,
      DOB: user.DOB.toDateString(),
      AddressFirst: user.AddressFirst,
      AddressSecond: user.AddressSecond,
      AddressThird: user.AddressThird,
      PostalCode: user.PostalCode,
      Email: user.Email,
    };

    return protoUser;
  }

  async removeUser(FindOneUserDto: FindOneUserDto) {
    const user = await this.usersService.remove({
      UserID: FindOneUserDto.UserID,
    });

    const protoUser: ProtoUser = {
      UserID: user.UserID,
      Username: user.Username,
      FirstName: user.FirstName,
      LastName: user.LastName,
      Role: user.Role,
      DOB: user.DOB.toDateString(),
      AddressFirst: user.AddressFirst,
      AddressSecond: user.AddressSecond,
      AddressThird: user.AddressThird,
      PostalCode: user.PostalCode,
      Email: user.Email,
    };

    return protoUser;
  }

  async login(LoginRequest: LoginRequest): Promise<LoginResponse> {
    return this.usersService.validateUser(
      LoginRequest.Username,
      LoginRequest.Password,
    );
  }
}
