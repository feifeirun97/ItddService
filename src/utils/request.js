/**
 * axios 网络请求工具
 * 更详细的 api 文档: http://www.axios-js.com/zh-cn/docs/
 */
import axios from "axios";
import { history } from "umi";
import { notification, message } from "antd";
import config from "../../config/appConfig";
import cookie from "react-cookies";
import _ from "lodash";


const codeMessage = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、账号、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。",
};
/**
 * 异常处理程序
 */
const errorHandler = (error) => {
  const { response } = error;
  message.destroy();
  console.log("response", response);
  if (response && response.status) {
    let errorText = codeMessage[response.status] || response.statusText;
    let { status, url } = response;
    if (status == 500 && response.data && response.data.code == "700")
      window.top.location.href = `${config.rootPath}#/login`;

    if (status == 500 && response.data && response.data.code == "600")
      errorText = response.data.msg;

    if (!status == 504) {
      notification.error({
        message: `请求错误 ${status}: ${url}`,
        description: errorText,
      });
    }
  } else if (!response) {
    notification.error({
      description: "您的网络发生异常，无法连接服务器",
      message: "网络异常",
    });
  }

  return response;
};
/**
 * 配置request请求时的默认参数
 */

axios.interceptors.response.use(
  function (response) {
    message.destroy();
    if (!response.data) {
      return response;
    }

    if (response.headers["content-type"].includes("octet-stream")) {
      return response;
    } else {
      if (response.data.respCode) {
        if (response.data.respCode == "0004") {
          window.top.location.href = `/user/login`;
          return;
        }
        if (
          response.data.respCode !== "9999" &&
          response.data.respCode !== "0000"
        ) {
          return new Promise((res, rej) => {
            notification.error({
              description: response.data.respMsg,
              message: "error",
            });
            rej(response);
          });
        }
      }
      return response;
    }
  },
  function (error) {
    // 对响应错误做点什么
    return new Promise((res, rej) => {
      rej(errorHandler(error));
    });
  }
);



const request = function (url, option) {
  message.loading(null, 0);
  var option = option || {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const headers = {
    seqNo: new Date().valueOf(),
    token: cookie.load(config.appId + "_token"),
    appid: config.appId,
  };
  if (option.headers && option.headers["Content-Type"]) {
    headers["Content-Type"] = option.headers["Content-Type"];
  }
  const API_ROOT = option.api ? option.api : config.api
  return axios({
    url: `${config.api}${
      url.includes("api") ? url.replace("/api", "service-postInvestment") : url
    }`,
    
    method: option.method || "POST",
    data: option.data || null,
    params: option.params || null,
    headers: headers,
    responseType: option.responseType || "json",
  });
};

export default request;
