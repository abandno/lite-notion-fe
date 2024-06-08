import {Button, Form, Input, notification} from 'antd';
import { useTranslation } from 'react-i18next';

import { SvgIcon } from '@/components/icon';

import { ReturnButton } from './components/ReturnButton';
import { LoginStateEnum, useLoginStateContext } from './providers/LoginStateProvider';
import { SmsCodeFormItemContent } from './components/SmsCode';
import userService from "@/api/services/userService.ts";
import {useUserInfo, useUserToken} from "@/store/userStore.ts";
import {useState} from "react";
import {hashPassword} from "@/utils";

function ResetForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const userInfo = useUserInfo();

  const onFinish = async (values: any) => {
    console.log('[ResetForm] Received values of form: ', values);
    const { backToLogin } = useLoginStateContext();
    setLoading(true);

    try {
      const res = await userService.resetPassword({
        userId: userInfo.id,
        phone: values.phone,
        password: hashPassword(values.password, values.phone),
        code: values.code
      });
      notification.success({
        message: t("sys.login.resetPasswordSuccess"),
        duration: 3,
      });

      // 回到登录Form
      backToLogin();
    } finally {
      setLoading(false)
    }
  };

  const { t } = useTranslation();
  const { loginState, backToLogin } = useLoginStateContext();

  if (loginState !== LoginStateEnum.RESET_PASSWORD) return null;

  const handleSendVcode = () => {
    const p = form.getFieldValue("phone");
    console.log("ResetForm sendVerifyCode", p);
    userService.sendVerifyCode({phone: p, type: "ResetPassword"});
  }

  return (
    <>
      <div className="mb-8 text-center">
        <SvgIcon icon="ic-reset-password" size="100" />
      </div>
      <div className="mb-8 text-center text-2xl font-bold xl:text-3xl">
        {t("sys.login.forgetFormTitle")}
      </div>
      <Form
        name="normal_login"
        size="large"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        {/* <p className="mb-4 h-14 text-center text-gray">
          {t("sys.login.forgetFormSecondTitle")}
        </p> */}
        <Form.Item
          name="phone"
          rules={[
            { required: true, message: t("sys.login.mobilePlaceholder") },
          ]}
        >
          <Input placeholder={t("sys.login.mobile")} />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: t("sys.login.passwordPlaceholder") },
          ]}
        >
          <Input placeholder={t("sys.login.password")} />
        </Form.Item>
        <Form.Item
          name="code"
          rules={[
            { required: true, message: t("sys.login.smsCodePlaceholder") },
          ]}
        >
          <SmsCodeFormItemContent onStart={handleSendVcode} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full !bg-black" loading={loading}>
            {t("sys.login.forgetFormTitle")}
          </Button>
        </Form.Item>

        <ReturnButton onClick={backToLogin} />
      </Form>
    </>
  );
}

export default ResetForm;
