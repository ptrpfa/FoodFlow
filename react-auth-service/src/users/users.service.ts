import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { UpdateUserDto, LoginResponse } from 'proto/auth';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.Password, 10);
    const iso_dob = new Date(data.DOB);
    const user = await this.prisma.user.create({
      data: {
        ...data,
        Password: hashedPassword,
        DOB: iso_dob,
      },
    });

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(UserID: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: UserID,
    });
  }

  async update(
    UserID: Prisma.UserWhereUniqueInput,
    UpdateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.prisma.user.update({
      where: UserID,
      data: UpdateUserDto,
    });
  }

  async remove(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
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
