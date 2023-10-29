/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "auth";

export interface UpdateUserDto {
  UserID: number;
  FirstName?: string | undefined;
  LastName?: string | undefined;
  DOB?: string | undefined;
  Role?: string | undefined;
  Password?: string | undefined;
  AddressFirst?: string | undefined;
  AddressSecond?: string | undefined;
  AddressThird?: string | undefined;
  PostalCode?: string | undefined;
  Email?: string | undefined;
}

export interface FindOneUserDto {
  UserID: number;
}

export interface Empty {
}

export interface LoginRequest {
  Username: string;
  Password: string;
}

export interface LoginResponse {
  Validated: boolean;
  AccessToken: string;
  UserID: number;
}

export interface Users {
  users: ProtoUser[];
}

export interface CreateUserDto {
  Username: string;
  FirstName: string;
  LastName: string;
  DOB: string;
  Role: string;
  Password: string;
  AddressFirst: string;
  AddressSecond: string;
  AddressThird: string;
  PostalCode: string;
  Email: string;
}

export interface ProtoUser {
  UserID: number;
  Username: string;
  FirstName: string;
  LastName: string;
  Role: string;
  AddressFirst: string;
  AddressSecond: string;
  AddressThird: string;
  PostalCode: string;
  Email: string;
}

export const AUTH_PACKAGE_NAME = "auth";

export interface UsersServiceClient {
  createUser(request: CreateUserDto): Observable<ProtoUser>;

  findAllUsers(request: Empty): Observable<Users>;

  findOneUser(request: FindOneUserDto): Observable<ProtoUser>;

  updateUser(request: UpdateUserDto): Observable<ProtoUser>;

  removeUser(request: FindOneUserDto): Observable<ProtoUser>;

  login(request: LoginRequest): Observable<LoginResponse>;
}

export interface UsersServiceController {
  createUser(request: CreateUserDto): Promise<ProtoUser> | Observable<ProtoUser> | ProtoUser;

  findAllUsers(request: Empty): Promise<Users> | Observable<Users> | Users;

  findOneUser(request: FindOneUserDto): Promise<ProtoUser> | Observable<ProtoUser> | ProtoUser;

  updateUser(request: UpdateUserDto): Promise<ProtoUser> | Observable<ProtoUser> | ProtoUser;

  removeUser(request: FindOneUserDto): Promise<ProtoUser> | Observable<ProtoUser> | ProtoUser;

  login(request: LoginRequest): Promise<LoginResponse> | Observable<LoginResponse> | LoginResponse;
}

export function UsersServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createUser", "findAllUsers", "findOneUser", "updateUser", "removeUser", "login"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UsersService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UsersService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USERS_SERVICE_NAME = "UsersService";
