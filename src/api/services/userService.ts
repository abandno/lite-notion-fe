import { get, post } from '@/utils/request';
import { UserInfo, UserToken } from '@/types/entity';

export interface SignInReq {
  username: string;
  password: string;
}

export interface SignUpReq extends SignInReq {
  email: string;
}
export type SignInRes = UserToken & { user: UserInfo };

export enum UserApi {
  SignIn = '/api/user/auth/signin',
  SignUp = '/api/user/auth/signup',
  Logout = '/api/user/auth/logout',
  Refresh = '/api/user/auth/refresh',
  User = '/api/user',
  SendVerifyCode = '/api/user/auth/sendVerifyCode',
  CodeSignIn = '/api/user/auth/codeSignIn',
  PasswordSignIn = '/api/user/auth/passwordSignIn',
  ResetPassword = '/api/user/auth/resetPassword',
}

const signin = (data: SignInReq) => post(UserApi.SignIn, data);
const signup = (data: SignUpReq) => post(UserApi.SignUp, data);
const logout = () => get(UserApi.Logout, {});
const findById = (id: string) => get(`${UserApi.User}/${id}`, {});
const sendVerifyCode = (param) => post(UserApi.SendVerifyCode, param)

export default {
  signin,
  signup,
  findById,
  logout,
  sendVerifyCode,
  codeSignIn: (param) => post(UserApi.CodeSignIn, param),
  passwordSignIn: (param) => post(UserApi.PasswordSignIn, param),
  resetPassword: (param) => post(UserApi.ResetPassword, param),
};
