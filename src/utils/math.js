/*
 * @Descripttion: 描述
 * @Author: ljz
 * @Date: 2020-08-28 19:10:39
 * @LastEditors: ljz
 * @LastEditTime: 2020-08-29 17:30:52
 */
import numeral from 'numeral';

export const keepTwoDecimal = val => Math.floor(val * 100) / 100;
// 转换为%  0.02 -> 2%
export const toPercenr = value => {

  if (value === null || isNaN(Number(value))) return ''
  return (Number(value) * 100).toFixed(2) + '%'
}

//转换为万  120000 -> 12  falg判断是否保留两位小数
export const toWan = (value) => {
  if (isNaN(Number(value))) return '-'
  return '¥' + numeral(Number(value / 10000).toFixed(2)).format('0,0.00') + '万'
}

export const saveTwoDecimal = value => {
  if (isNaN(Number(value))) return '-'
  return Number(value).toFixed(2)
}

//切换K, M, B
export const toDollar = (value, quantity) => {
  let q = quantity === "Raw" ? 1 : quantity === "Thousand" ? 1000 : quantity === "Million" ? 1000000 : 1000000000
  let num = Number(value) / q
  if (isNaN(num)) return '-'
  if (num === 0) return '$0'
  // console.log(quantity)
  if (Math.abs(num) < 0.01) return 'N/A'
  if (q === 1000) return numeral(num).format('$0,0.0') + 'K'
  else if (q === 1000000) return numeral(num).format('$0,0.0') + 'M'
  else if (q === 1000000000) return numeral(num).format('$0,0.0') + 'B'
  return numeral(num).format('$0,0.0')
}

// 格式化金额，自动进位切换K，M，B、
export const toDollarAuto = (value) => {
  if (isNaN(value)) return '-'
  if (value === 0) return '$0'
  
  if (Math.abs(value) >= 1000000000) return numeral(value/1000000000).format('$0,0.00') + 'B'
  else if (Math.abs(value) >= 1000000) return numeral(value/1000000).format('$0,0.00') + 'M'
  else if (Math.abs(value) >= 1000) return numeral(value/1000).format('$0,0.00') + 'K'
  return numeral(value).format('$0,0.00')
}

// 格式化数量(三位分隔)
export const toCount = function (val) {
  if (val==='') return "-"
  if (isNaN(val) || val===false) return "-"
  const decimalAmount = keepTwoDecimal(val);
  return numeral(decimalAmount).format('0,0');
};

// 格式化图标数据(三位分隔)，自动进位切换K，M，B、
export const toChartData = function (value,isPer) {

  if (value==='' || value===false) return "-"
  if (value === 0) return '0'
  if (isPer) return keepTwoDecimal(value)+'%'
  
  if (Math.abs(value) >= 1000000000) return numeral(value/1000000000).format('0,0.00') + 'B'
  else if (Math.abs(value) >= 1000000) return numeral(value/1000000).format('0,0.00') + 'M'
  else if (Math.abs(value) >= 1000) return numeral(value/1000).format('0,0.00') + 'K'
  return  numeral(value).format('0,0.00')
};

// 格式化百分比(三位分隔)
export const toPercentage = function (val) {
  if (val==='') return "-"
  if (val===0) return '0%'
  const decimalAmount = keepTwoDecimal(val);
  return numeral(decimalAmount).format('0,0.00') +'%';
};
// 格式化百分比(三位分隔)
export const toPercentageChart = function (val) {
  // console.log('接收到的val',val,'是否为空？',)
  if (isNaN(val) || val===false) return "-"
  const decimalAmount = keepTwoDecimal(val);
  return numeral(decimalAmount).format('0,0') +'%';

};

export const toPercentageTrend = function (val,display) {
  //trendSummary模块独有，当display=true返回‘-’
  if (val===''&&display) return "-"
  if (val===false) return "-"
  if (val==='') return ""
  // if (val===false) return '-'
  if (val===0&&display) return '0%'
  if (val===0) return ''

  const decimalAmount = keepTwoDecimal(val);
  return numeral(decimalAmount).format('0,0.00') +'%';
};
