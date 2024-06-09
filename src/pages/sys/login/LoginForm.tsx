import {Button, Form, Input, notification, Statistic, Tabs} from 'antd';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import userService from '@/api/services/userService';
import {LoginStateEnum, useLoginStateContext} from './providers/LoginStateProvider';
import styled from "styled-components";
import {SmsCodeFormItemContent} from './components/SmsCode';
import {useNavigate} from "react-router-dom";
import {useUserActions} from '@/store/userStore';
import {hashPassword} from "@/utils";

// @ts-ignore
const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;

const StyledButton = styled(Button)`
  &:hover {
    background: none !important;
    color: blue !important;
  }
`;

const IButton = ({children, type = "text", size = "default", ...rest}) => {
  return (
    // @ts-ignore
    <StyledButton type={type} size={size} {...rest}>
      {children}
    </StyledButton>
  );
};

const PhoneLoginForm = () => {
  const { t } = useTranslation();
  const navigatge = useNavigate();
  const { setUserToken, setUserInfo } = useUserActions();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSendVcode = async () => {
    const p = form.getFieldValue("phone");
    console.log("sendVerifyCode", p);
    if (!p) {
      return false;
    }
    await userService.sendVerifyCode({phone: p, type: "PhoneLogin"});
    return true;
  }

  const handleFinish = async (values) => {
    console.log("PhoneLoginForm handleFinish", values);
    setLoading(true);
    try {
      const res = await userService.codeSignIn(values);
      const { user, accessToken, refreshToken } = res?.data;
      setUserToken({ accessToken, refreshToken });
      setUserInfo(user);
      navigatge(HOMEPAGE, { replace: true });

      notification.success({
        message: t("sys.login.loginSuccessTitle"),
        description: `${t("sys.login.loginSuccessDesc")}: ${user.nickname}`,
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form
        form={form}
        name="login"
        size="large"
        onFinish={handleFinish}
      >
        <Form.Item
          name="phone"
          rules={[
            { required: true, message: t("sys.login.mobilePlaceholder") },
          ]}
        >
          <Input placeholder={t("sys.login.mobile")} />
        </Form.Item>
        <Form.Item
          name="code"
          rules={[
            { required: true, message: t("sys.login.smsCodePlaceholder") },
          ]}
        >
          <SmsCodeFormItemContent
            onStart={handleSendVcode}
            onChange={(value) => form.setFieldsValue({ code: value })}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full" loading={loading}>
            {t("sys.login.loginButton")}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}


const PasswordLoginForm = () => {
  const { t } = useTranslation();
  const { setLoginState } = useLoginStateContext();
  const navigatge = useNavigate();
  const { setUserToken, setUserInfo } = useUserActions();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values) => {
    console.log("[PasswordLoginForm] handleFinish", values);
    setLoading(true);
    const {username, password} = values;
    try {
      const passwordHash = hashPassword(password, username)
      const res = await userService.passwordSignIn({username, password: passwordHash});
      const { user, accessToken, refreshToken } = res?.data;
      setUserToken({ accessToken, refreshToken });
      setUserInfo(user);
      navigatge(HOMEPAGE, { replace: true });

      notification.success({
        message: t("sys.login.loginSuccessTitle"),
        description: `${t("sys.login.loginSuccessDesc")}: ${user.nickname}`,
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form
        name="login"
        size="large"
        onFinish={handleFinish}
      >
        <Form.Item
          name="username"
          rules={[
            { required: true, message: t("sys.login.mobilePlaceholder") },
          ]}
        >
          <Input placeholder={t("sys.login.mobile")} />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: t("sys.login.password") }]}
        >
          <Input.Password
            placeholder={t("sys.login.password")}
            addonAfter={
              <IButton
                type="text"
                size="small"
                onClick={() => setLoginState(LoginStateEnum.RESET_PASSWORD)}
              >
                忘记密码
              </IButton>
            }
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full" loading={loading}>
            {t("sys.login.loginButton")}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

function LoginForm() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const { loginState } = useLoginStateContext();

  // if (loginState !== LoginStateEnum.LOGIN) return null;
  if ([LoginStateEnum.CODE_LOGIN, LoginStateEnum.PASSWORD_LOGIN].includes(loginState) == false) return null


  const tabItems = [
    {
      label: "验证码登录",
      key: "PhoneLoginForm",
      children: <PhoneLoginForm />,
    },
    {
      label: "密码登录",
      key: "PasswordLoginForm",
      children: <PasswordLoginForm />,
    },
  ];
  const defaultActiveKey = loginState == LoginStateEnum.CODE_LOGIN ? "PhoneLoginForm" : "PasswordLoginForm"

  return (
    <>
      <div className="mb-8 text-2xl font-bold xl:text-3xl">
        {t("sys.login.signInFormTitle")}
      </div>
      <Tabs type="card" items={tabItems} defaultActiveKey={defaultActiveKey} />
    </>
  );
}

export default LoginForm;
