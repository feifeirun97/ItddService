import React, { useCallback } from 'react';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin, message } from 'antd';
import { history, useModel } from 'umi';
import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { outLogin } from '@/services/ant-design-pro/api';
import { useIntl } from 'umi';
import cookies from "react-cookies";
import config from "../../../config/appConfig"

const AvatarDropdown = ({ menu }) => {
  const intl = useIntl();
  const { initialState, setInitialState } = useModel('@@initialState');

  /**
 * 退出登录，并且将当前的 url 保存
 */
  const loginOut = () => {
    cookies.remove(config.appId + "_" + "token",);
    cookies.remove(config.appId + "_" + "userId",);
    cookies.remove(config.appId + "_" + "account",);
    history.replace({
      pathname: '/user/login',
    });
    message.success(intl.formatMessage({ id: 'pages.logout.success', defaultMessage: '登录成功！', }));
  };



  const onMenuClick = useCallback(
    (event) => {
      const { key } = event;

      if (key === 'logout') {
        setInitialState((s) => ({ ...s, currentUser: undefined }));
        loginOut();
        return;
      }

      history.push(`/account/${key}`);
    },
    [setInitialState],
  );
  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.name) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {/* {menu && (
        <Menu.Item key="center">
          <UserOutlined />
          个人中心
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key="settings">
          <SettingOutlined />
          个人设置
        </Menu.Item>
      )} */}
      {/* {menu && <Menu.Divider />} */}

      <Menu.Item key="logout">
        <LogoutOutlined />
        {intl.formatMessage({ id: 'pages.logout.success' })}
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
        <span className={`${styles.name} anticon`}>{currentUser.name}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
