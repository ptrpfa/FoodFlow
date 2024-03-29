import { UsersServiceClient } from "./grpc/auth/auth_grpc_web_pb";
import {
  LoginRequest,
  UpdateUserDto,
  CreateUserDto,
  FindOneUserDto,
} from "./grpc/auth/auth_pb";

const auth_client = new UsersServiceClient(
  "http://localhost:9900/grpc-auth",
  null,
  null
);

class AuthService {
  login = async (payload) => {
    let message = new LoginRequest();
    message.setUsername(payload.Username);
    message.setPassword(payload.Password);

    return new Promise((resolve, reject) => {
      // gRPC
      auth_client.login(message, null, (err, response) => {
        if (err) {
          // If an error occurs, reject the promise and pass the error to the `.catch()` handler.
          reject(err);
        } else {
          resolve({
            validated: response.getValidated(),
            token: response.getAccesstoken(),
            userid: response.getUserid(),
          });
        }
      });
    });
  };

  register = async (credentials) => {
    let message = new CreateUserDto();
    message.setUsername(credentials.Username);
    message.setFirstname(credentials.FirstName);
    message.setLastname(credentials.LastName);
    message.setDob(credentials.DOB);
    message.setRole(credentials.Role);
    message.setPassword(credentials.Password);
    message.setAddressfirst(credentials.AddressFirst);
    message.setAddresssecond(credentials.AddressSecond);
    message.setAddressthird(credentials.AddressThird);
    message.setPostalcode(credentials.PostalCode);
    message.setEmail(credentials.Email);

    return new Promise((resolve, reject) => {
      // gRPC
      auth_client.createUser(message, null, (err, response) => {
        if (err) {
          // If an error occurs, reject the promise and pass the error to the `.catch()` handler.
          reject(err);
        } else {
          resolve({
            userid: response.getUserid(),
          });
        }
      });
    });
  };

  getProfile = async (payload) => {
    let message = new FindOneUserDto();
    message.setUserid(payload.UserID);

    return new Promise((resolve, reject) => {
      // gRPC
      auth_client.findOneUser(message, null, (err, response) => {
        if (err) {
          // If an error occurs, reject the promise and pass the error to the `.catch()` handler.
          reject(err);
        } else {
          resolve({
            username: response.getUsername(),
            firstName: response.getFirstname(),
            LastName: response.getLastname(),
            dob: response.getDob(),
            role: response.getRole(),
            addressFirst: response.getAddressfirst(),
            addressSecond: response.getAddresssecond(),
            addressThird: response.getAddressthird(),
            postalCode: response.getPostalcode(),
            email: response.getEmail(),
          });
        }
      });
    });
  };

  deleteProfile = async (payload) => {
    let message = new FindOneUserDto();
    message.setUserid(payload.UserID);

    return new Promise((resolve, reject) => {
      // gRPC
      auth_client.removeUser(message, null, (err, response) => {
        if (err) {
          // If an error occurs, reject the promise and pass the error to the `.catch()` handler.
          reject(err);
        } else {
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
        }
      });
    });
  };
  
  updateProfile = async (newInfo) => {
    let message = new UpdateUserDto();
    message.setUserid(newInfo.userid);
    if ('firstName' in newInfo) message.setFirstname(newInfo.firstName);
    if ('lastName' in newInfo) message.setLastname(newInfo.lastName);
    if ('role' in newInfo) message.setRole(newInfo.role);
    if ('dob' in newInfo) message.setDob(newInfo.dob);
    if ('password' in newInfo) message.setPassword(newInfo.password);
    if ('addressFirst' in newInfo) message.setAddressfirst(newInfo.addressFirst);
    if ('addressSecond' in newInfo) message.setAddresssecond(newInfo.addressSecond);
    if ('addressThird' in newInfo) message.setAddressthird(newInfo.addressThird);
    if ('postalCode' in newInfo) message.setPostalcode(newInfo.postalCode);
    if ('email' in newInfo) message.setEmail(newInfo.email);

    return new Promise((resolve, reject) => {
      // gRPC
      auth_client.updateUser(message, null, (err, response) => {
        if (err) {
          // If an error occurs, reject the promise and pass the error to the `.catch()` handler.
          reject(err);
        } else {
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
        }
      });
    });
  };
}

export default new AuthService();
