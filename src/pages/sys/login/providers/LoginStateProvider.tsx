import { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react';

export enum LoginStateEnum {
  CODE_LOGIN,
  PASSWORD_LOGIN,
  REGISTER,
  // 忘记密码, 重置密码
  RESET_PASSWORD,
  MOBILE,
  QR_CODE,
}

interface LoginStateContextType {
  loginState: LoginStateEnum;
  setLoginState: (loginState: LoginStateEnum) => void;
  backToLogin: () => void;
}
const LoginStateContext = createContext<LoginStateContextType>({
  loginState: LoginStateEnum.CODE_LOGIN,
  setLoginState: () => {},
  backToLogin: () => {},
});

export function useLoginStateContext() {
  const context = useContext(LoginStateContext);
  return context;
}

export function LoginStateProvider({ children }: PropsWithChildren) {
  const [loginState, setLoginState] = useState(LoginStateEnum.CODE_LOGIN);

  function backToLogin() {
    setLoginState(LoginStateEnum.CODE_LOGIN);
  }

  const value: LoginStateContextType = useMemo(
    () => ({ loginState, setLoginState, backToLogin }),
    [loginState],
  );
  return <LoginStateContext.Provider value={value}>{children}</LoginStateContext.Provider>;
}
