import { Button, Col, Input, Row, Statistic } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
const { Countdown } = Statistic;

export const SmsCodeFormItemContent = ({onStart=undefined, onChange=undefined, ...rest}) => {
  const { t } = useTranslation();
  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
  };

  const [countdown, setCountdown] = useState(0); // 倒计时的秒数
  const [second, setSecond] = useState(0);

  const start = () => {
    // 发送验证码请求
    onStart && onStart();
    setCountdown(60);
    setSecond(60);
  };

  const reset = () => {
    // 启动倒计时
    setCountdown(0);
    setSecond(60);
  };

  return (
    <Row justify="space-between">
      <Col span={14}>
        <Input
          placeholder={t("sys.login.smsCode")}
          onChange={(e) => onChange && onChange(e.target.value)}
        />
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
  );
};
