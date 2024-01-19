import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { UpdateUserDto, LoginResponse, ProtoUser, Users } from 'proto/auth';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  parseProtouser(data: User): ProtoUser {
    return {
      UserID: data.UserID,
      Username: data.Username,
      FirstName: data.FirstName,
      LastName: data.LastName,
      Role: data.Role,
      DOB: data.DOB.toDateString(),
      AddressFirst: data.AddressFirst,
      AddressSecond: data.AddressSecond,
      AddressThird: data.AddressThird,
      PostalCode: data.PostalCode,
      Email: data.Email,
    };
  }

  parseProtouserArray(data: User[]): Users {
    const protoUsers: ProtoUser[] = data.map((user) => ({
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

    return {
      users: protoUsers,
    };
  }

  async create(data: Prisma.UserCreateInput): Promise<ProtoUser> {
    const hashedPassword = await bcrypt.hash(data.Password, 10);
    const iso_dob = new Date(data.DOB);
    const user = await this.prisma.user.create({
      data: {
        ...data,
        Password: hashedPassword,
        DOB: iso_dob,
      },
    });

    return this.parseProtouser(user);
  }

  async findAll(): Promise<Users> {
    return this.parseProtouserArray(await this.prisma.user.findMany());
  }

  async findOne(
    UserID: Prisma.UserWhereUniqueInput,
  ): Promise<ProtoUser | null> {
    const user = await this.prisma.user.findUnique({
      where: UserID,
    });

    return user ? this.parseProtouser(user) : null;
  }

  async update(
    UserID: Prisma.UserWhereUniqueInput,
    UpdateUserDto: UpdateUserDto,
  ): Promise<ProtoUser> {
    return this.parseProtouser(
      await this.prisma.user.update({
        where: UserID,
        data: UpdateUserDto,
      }),
    );
  }

  async remove(where: Prisma.UserWhereUniqueInput): Promise<ProtoUser> {
    return this.parseProtouser(
      await this.prisma.user.delete({
        where,
      }),
    );
  }

  async validateUser(
    Username: string,
    password: string,
  ): Promise<LoginResponse> {
    const user = await this.prisma.user.findUnique({
      where: {
        Username: Username,
      },
    });

    if (user && (await bcrypt.compare(password, user.Password))) {
      // bcrypt for password hashing
      const payload = { Username: user.Username, sub: user.UserID };
      return {
        Validated: true,
        AccessToken: await this.jwtService.signAsync(payload),
        UserID: user.UserID,
      };
    }
    return {
      Validated: false,
      AccessToken: '-1',
      UserID: -1,
    };
  }
}
