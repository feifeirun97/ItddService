/*
 * @Descripttion: 描述
 * @Author: ljz
 * @Date: 2020-08-28 19:10:38
 * @LastEditors: ljz
 * @LastEditTime: 2020-08-29 13:05:32
 */
import cookie from "react-cookies";

// new WebSocket(`ws://${config.api}service-postInvestment/websocket/${userId}`);

//配置信息

const config = {
  /* dev localhost start */
  api: 'http://api.opm.dev.aitaigroup.com/',
  appId: '16999',
  host: () => {
  	return 'http://api.opm.dev.aitaigroup.com/InvestManagement';
  },
  cloudHost: 'http://47.103.124.165:8081/cloudFile/',
  rootPath: '/InvestManagement/framework/',
  socketApi: 'ws://api.opm.dev.aitaigroup.com/'
  /* dev end */

  /***/
  // api: "http://47.95.36.81:8081/",
  // appId: "16999",
  // host: () => {
  //   return "http://47.95.36.81:8081/InvestManagement";
  // },
  // cloudHost: "http://47.95.36.81:8081/cloudFile/",
  // rootPath: "/InvestManagement/framework/",
  // socketApi: "ws://api.opm.dev.aitaigroup.com/",
  /****/

  /* poc start */
  // api: 'http://172.16.9.62:8081/',
  // appId: '16999',
  // host: () => {
  // 	return 'http://172.16.9.62:8081/InvestManagement';
  // },
  // cloudHost: 'http://47.103.124.165:8081/cloudFile/',
  // rootPath: '/InvestManagement/framework/',
  /* sit end */

  /* pit-demo http://47.103.124.165:8081 local poc start */
  // api: 'http://47.103.124.165:8081/',
  // appId: '16999',
  // rootPath: '/InvestManagement/framework/',
  // host: () => {
  // 	// 本地环境run
  // 	return 'http://47.103.124.165:8081/InvestManagement'
  // },
  // cloudHost: 'http://47.103.124.165:8081/cloudFile/',
  /* sit end */

  /* local start */
  // api: 'http://localhost/',
  // appId: '16999',
  // rootPath: '/InvestManagement/framework/',
  // host: function(){
  // 	var hs = window.location.href.split('/');
  // 	return hs[0]+'//'+hs[2]+'/'+hs[3];
  // },
  // cloudHost: 'http://47.103.124.165:8081/cloudFile/',
  /* local end */
};
//获取当前用户信息
const getUserInfo = () => {
  let roleId = cookie.load(config.appId + "_roleId") || "";
  let groupId = cookie.load(config.appId + "_groupId") || "";
  let map = {
    0: "admin",
    2: "admin",
    3: "company",
    10: "CIM",
    "-1": "LOAN",
  };
  let role = map[roleId] || "admin"; // CIM
  config["user"] = {
    role: role,
    roleId: roleId,
    groupId: groupId,
    token: cookie.load(config.appId + "_token") || "",
    name: cookie.load(config.appId + "_account") || "",
    avatar: cookie.load(config.appId + "_avatar") || "",
    iconUrl: cookie.load(config.appId + "_iconUrl") || "",
  };
};
getUserInfo();
// console.log('config: ', config)

export default config;
