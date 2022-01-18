import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
  MailTwoTone
} from '@ant-design/icons';
import { Alert, message, Tabs, Button } from 'antd';
import React, { useState } from 'react';
import { ProFormCaptcha, ProFormCheckbox, ProFormText, LoginForm } from '@ant-design/pro-form';
import { useIntl, history, FormattedMessage, SelectLang, useModel } from 'umi';
import Footer from '@/components/Footer';
import { login } from '@/services/ant-design-pro/api';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import { ESCEncryptionData } from '@/utils/encryption'
import config from "../../../../config/appConfig"
import styles from './index.less';
import cookies from "react-cookies";


const LoginMessage = ({ content }) => (
  <Alert
    style={{
      // marginTop: 24,
      position: 'absolute',
      top: '10px'
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = () => {
  // const [year, month , day] = [new Date.get
  const [userLoginState, setUserLoginState] = useState({});
  const [type, setType] = useState('account');
  const [uuid, setUuid] = useState(new Date().valueOf());
  const { initialState, setInitialState } = useModel('@@initialState');
  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = {
      "name": "Serati Ma",
      "avatar": "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
      "userid": "00000001",
      "email": "antdesign@alipay.com",
      "signature": "海纳百川，有容乃大",
      "title": "交互专家",
      "group": "蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED",
      "tags": [],
      "notifyCount": 12,
      "unreadCount": 11,
      "country": "China",
      "access": "user",
      "geographic": {},
      "address": "",
      "phone": ""
    }
    await setInitialState((s) => ({ ...s, currentUser: userInfo }));
  };
  const handleSubmit = async (values) => {
    // 登录
    const response = await fetch(`${config.api}service-postInvestment/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          seqNo: new Date().valueOf(),
          appid: config.appId,
        },
        body: ESCEncryptionData(
          {
            loginName: values.username,
            password: values.password,
            uuid: uuid,
            CODE: values.verification,
          }),
      }).then(res => res.json())

    const msg = { status: response.respCode, respMsg: response.respMsg, type: 'account' }
    console.log(response)

    if (msg.status === '0000') {
      const defaultLoginSuccessMessage = intl.formatMessage({ id: 'pages.login.success', defaultMessage: '登录成功！', });
      message.success(defaultLoginSuccessMessage);
      cookies.save(config.appId + "_" + "token", response.data.token,);
      cookies.save(config.appId + "_" + "userId", response.data.userId, );
      cookies.save(config.appId + "_" + "account", response.data.account, );

      await fetchUserInfo();
      /** 此方法会跳转到 redirect 参数所在的位置 */

      if (!history) return;
      const { query } = history.location;
      const { redirect } = query;
      history.push('/user/projList');

      return;
    }
    else {
      message.error(msg.respMsg);
      setUuid(new Date().valueOf())
    }
    console.log(msg); // 如果失败去设置用户错误信息

    setUserLoginState(msg);

  };
  const { status, type: loginType, respMSg } = userLoginState;
  const landingMessage = intl.formatMessage({
    id: 'pages.login.landing',
  });
  return (
    <div className={styles.container11}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>

      <img style={{ width: '160px', margin: '0 auto', display: 'block' }} alt="logo" src="http://api.opm.dev.aitaigroup.com/InvestManagement/framework/static/maxval_highres.7018e226.png" />
      <div className={styles.content}>
        <div className={styles.welcomeText}>{landingMessage}</div>
        <div className={styles.timeText}>{JSON.stringify(new Date).split('T')[0].replace('"', '')}</div>
        <LoginForm
          initialValues={{ autoLogin: true, }}
          onFinish={async (values) => {
            await handleSubmit(values);
          }}
        >
          {/* {status !== '0000' && loginType === 'account' && (
            <LoginMessage
              content={userLoginState.respMSg}
            />
          )} */}
          {type === 'account' && (
            <>
              <ProFormText
                width='240px'
                name="username"
                fieldProps={{
                  // size: 'lg',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.username.placeholder',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required" />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                width='240px'
                name="password"
                fieldProps={{
                  // size: 'small',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '密码',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', width: 240, height: 32, marginTop: '-25px' }}>
                <ProFormText
                  width='130px'
                  name="verification"

                  placeholder={intl.formatMessage({
                    id: 'pages.login.captcha.placeholder',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id='pages.login.captcha.required'
                        />
                      ),
                    },
                  ]}
                />
                <img onClick={() => { const a = new Date().valueOf(); setUuid(a) }} style={{ width: '90px', height: '32px' }} src={`http://api.opm.dev.aitaigroup.com/service-postInvestment/getCode?uuid=${uuid}`} alt="loading" />
              </div>
            </>
          )}






        </LoginForm>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Login;
