import { Alert, Button, Checkbox, Col, Divider, Form, Input, Row } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiFillGithub, AiFillGoogleCircle, AiFillWechat } from 'react-icons/ai';

import { DEFAULT_USER, TEST_USER } from '@/_mock/assets';
import { SignInReq } from '@/api/services/userService';
import { useSignIn } from '@/store/userStore';
import ProTag from '@/theme/antd/components/tag';
import { useThemeToken } from '@/theme/hooks';

import { LoginStateEnum, useLoginStateContext } from './providers/LoginStateProvider';
import { Tabs, Statistic } from "antd";
const { Countdown } = Statistic;

import styled from "styled-components";
import { ButtonType } from 'antd/es/button';

const StyledButton = styled(Button)`
  &:hover {
    background: none !important;
    color: blue !important;
  }
`;

const IButton = ({children, type = "text", size = "default", ...rest}) => {
  return (
    <StyledButton type={type} size={size} {...rest}>
      {children}
    </StyledButton>
  );
};

const PhoneLoginForm = () => {
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState(0); // 倒计时的秒数
  const [second, setSecond] = useState(0);
  const start = () => {
    // TODO: 发送验证码请求
    setCountdown(60);
    setSecond(60);
  };
  const reset = () => {
    // 启动倒计时
    setCountdown(0);
    setSecond(60);
  };

  return (
    <>
      <Form
        name="login"
        size="large"
        // onFinish={handleFinish}
      >
        <Form.Item
          name="phone"
          rules={[
            { required: true, message: t("sys.login.mobilePlaceholder") },
          ]}
        >
          <Input placeholder={t("sys.login.mobilePlaceholder")} />
        </Form.Item>
        <Form.Item
          name="code"
          rules={[
            { required: true, message: t("sys.login.smsCodePlaceholder") },
          ]}
        >
          <Row justify="space-between">
            <Col span={14}>
              <Input placeholder={t("sys.login.smsCode")} />
            </Col>
            <Col span={9} flex={1}>
              <Button
                disabled={countdown !== 0}
                className="w-full !text-sm"
                onClick={start}
              >
                {countdown === 0 ? (
                  <span>{t("sys.login.sendSmsButton")}</span>
                ) : (
                  <div className="flex items-center justify-center">
                    <Countdown
                      className="hidden"
                      value={Date.now() + countdown * 1000}
                      onChange={(time) => {
                        setCountdown(Number(time) / 1000);
                        setSecond(Math.floor(Number(time) / 1000));
                      }}
                      format="ss"
                      onFinish={reset}
                    />
                    <span className="ml-1">
                      {t("sys.login.sendSmsText", { second })}
                    </span>
                  </div>
                )}
              </Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            {t("sys.login.loginButton")}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}


const PasswordLoginForm = () => {
  const { t } = useTranslation();
  const { loginState, setLoginState } = useLoginStateContext();

 
  return (
    <>
      <Form
        name="login"
        size="large"
        // onFinish={handleFinish}
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
          <Button type="primary" htmlType="submit" className="w-full">
            {t("sys.login.loginButton")}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

function LoginForm() {
  const { t } = useTranslation();
  const themeToken = useThemeToken();
  const [loading, setLoading] = useState(false);

  const { loginState, setLoginState } = useLoginStateContext();
  const signIn = useSignIn();

  if (loginState !== LoginStateEnum.LOGIN) return null;

  const handleFinish = async ({ username, password }: SignInReq) => {
    setLoading(true);
    try {
      await signIn({ username, password });
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <>
      <div className="mb-8 text-2xl font-bold xl:text-3xl">
        {t("sys.login.signInFormTitle")}
      </div>
      <Tabs type="card" items={tabItems} />
    </>
  );
}

export default LoginForm;
