const Settings = {
  "navTheme": "light",
  "layout": "side",
  "contentWidth": "Fixed",
  "headerHeight": 48,
  "primaryColor": "#1890ff",
  "splitMenus": false,
  "fixedHeader": false,
  "fixSiderbar": false,
  "collapsed":true,

  "siderWidth":500,
  // title:'metrics',
  logo:'http://api.opm.dev.aitaigroup.com/InvestManagement/framework/static/maxval_highres.7018e226.png',
}
export default Settings;



//
//函数调用 => 内存生成调用帧 => 所有调用帧 =>调用栈
//调用帧：call frame 保存函数调用位置和内部变量信息。
//举例：函数A内部调用函数B，那么在A的调用帧上方还会生成一个B的调用帧，等B运行结束把结果返回给A这时B的调用帧才消失
//递归非常耗费内存，**就是因为需要同时保存成千上万个调用帧，很容易发生“栈溢出”错误（stack overflow）**。
