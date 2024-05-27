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
  SignIn = '/auth/signin',
  SignUp = '/auth/signup',
  Logout = '/auth/logout',
  Refresh = '/auth/refresh',
  User = '/user',
}

const signin = (data: SignInReq) => post(UserApi.SignIn, data);
const signup = (data: SignUpReq) => post(UserApi.SignUp, data);
const logout = () => get(UserApi.Logout, {});
const findById = (id: string) => get(`${UserApi.User}/${id}`, {});

export default {
  signin,
  signup,
  findById,
  logout,
};
