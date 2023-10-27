import HttpService from "./htttp.service";
import { UsersServiceClient } from "./grpc/auth/auth_grpc_web_pb";
import {
  LoginRequest,
  UpdateUserDto,
  CreateUserDto,
  FindOneUserDto,
} from "./grpc/auth/auth_pb";

const auth_client = new UsersServiceClient("http://localhost:9900", null, null);

class AuthService {
  login = async (payload) => {
    let message = new LoginRequest();
    message.setUsername(payload.Username);
    message.setPassword(payload.Password);

    return new Promise((resolve, reject) => {
      // gRPC
      auth_client.login(message, null, (err, response) => {
        resolve({
          validated: response.getValidated(),
          token: response.getAccesstoken(),
        });
      });
    });
  };

  register = async (credentials) => {
    let message = new CreateUserDto();
    message.setUsername(credentials.Username);
    message.setPassword(credentials.FirstName);
    message.setLastname(credentials.LastName);
    message.setDob(credentials.DOB);
    message.setRole(credentials.Role);
    message.setPassword(credentials.Password);
    message.setAddressfirst(credentials.AddressFirst);
    message.setAddresssecond(credentials.AddressSecond);
    message.setAddressThird(credentials.AddressThird);
    message.setPostalcode(credentials.PostalCode);
    message.setEmail(credentials.Email);

    return new Promise((resolve, reject) => {
      // gRPC
      auth_client.createUser(message, null, (err, response) => {
        resolve({
          userid: response.getUserid(),
        });
      });
    });
  };

  // Future implementation
  // forgotPassword = async (payload) => {
  //   const forgotPassword = "password-forgot";
  //   return await HttpService.post(forgotPassword, payload);
  // };

  // resetPassword = async (credentials) => {
  //   const resetPassword = "password-reset";
  //   return await HttpService.post(resetPassword, credentials);
  // };

  getProfile = async () => {
    let message = new FindOneUserDto();
    message.setUserid(payload.UserID);

    return new Promise((resolve, reject) => {
      // gRPC
      auth_client.findOneUser(message, null, (err, response) => {
        resolve({
          username: response.getUsername(),
          firstName: response.getFirstname(),
          LastName: response.getLastname(),
          role: response.getRole(),
          addressFirst: response.getAddressfirst(),
          addressSecond: response.getAddresssecond(),
          addressThird: response.getAddressthird(),
          postalCode: response.getPostalcode(),
          email: response.getEmail(),
        });
      });
    });
  };

  // TODO: Implement
  updateProfile = async (newInfo) => {
    let message = new UpdateUserDto();
    message.setUsername(newInfo.Username);
    message.setPassword(newInfo.Password);

    return new Promise((resolve, reject) => {
      // gRPC
      auth_client.updateUser(message, null, (err, response) => {
        resolve({
          validated: response.getValidated(),
          token: response.getAccesstoken(),
        });
      });
    });
  };
}

export default new AuthService();
