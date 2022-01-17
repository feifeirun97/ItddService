import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import styles from '../style.less'
// 基于准备好的dom，初始化echarts实例
import { toPercentageChart, toChartData, keepTwoDecimal } from "@/utils/math"
import { custTheme } from './custTheme'
import _ from "lodash";



const calYaxis = (data1) => {
  const sortedLine = data1.line_data.flat(Infinity).filter(num=>typeof(num)==='number').sort((a, b) => a - b)
  const lineMax = sortedLine[sortedLine.length-1]< Math.abs(sortedLine[0]) ?  Math.abs(sortedLine[0]) : sortedLine[sortedLine.length-1]

  const sum = (arr) => {
    let [p, n] = [0, 0]
    arr.forEach(s => s > 0 ? p += s : n += s)
    return [p, n]
  }
  const bar = data1.bar_data.reduce((accumulator, item) => {
    let [max, min] = sum(item.filter(num => { return typeof (num) === 'number' }))
    if (max > accumulator.max) { accumulator.max = max }
    if (min < accumulator.min) { accumulator.min = min }
    accumulator
    return accumulator
  }, { max: 0, min: 0 })

  if (bar.max < Math.abs(bar.min)) { bar.max = Math.abs(bar.min) }
  const barMax = bar.max
  return [lineMax, sortedLine[0], barMax, bar.min]
}
const colors = [
  ['rgba(43, 217, 227, 0.5)', 'rgba(43, 217, 227, 0.2)'],
  ['rgba(168, 106, 106, 0.5)', 'rgba(168, 106, 106, 0.2)'],

  ['rgba(238, 153, 63, 0.5)', 'rgba(238, 153, 63, 0.2)'],
  ['rgba(48, 183, 183, 0.5)', 'rgba(48, 183, 183, 0.2)'],

  ['rgba(65, 167, 220, 0.5)', 'rgba(65, 167, 220, 0.2)'],
  ['rgba(102, 224, 186, 0.5)', 'rgba(102, 224, 186, 0.2)'],
  ['rgba(88, 98, 132, 0.5)', 'rgba(88, 98, 132, 0.2)'],
  ['rgba(151, 158, 224, 0.5)', 'rgba(151, 158, 224, 0.2)'],
  ['rgba(189, 230, 166, 0.5)', 'rgba(189, 230, 166, 0.2)'],
  ['rgba(143, 217, 227, 0.5)', 'rgba(143, 217, 227, 0.2)'],

  ['rgba(182, 38, 43, 0.5)', 'rgba(182, 38, 43, 0.2)'],
  ['rgba(250, 123, 94, 0.5)', 'rgba(250, 123, 94, 0.2)'],
  ['rgba(134, 148, 128, 0.5)', 'rgba(134, 148, 128, 0.2)'],
  ['rgba(196, 104, 164, 0.5)', 'rgba(196, 104, 164, 0.2)'],


]

const BarLineFraud = ({ index, data, isPer }) => {


  useEffect(() => {
    echarts.registerTheme('chalk', custTheme)
    let myChart = echarts.init(document.getElementById(`main${index}`), 'chalk');
    console.log('chartData', data)
    if (data) {

      let chartData = data
      const [lineMax, lineMin, barMax, barMin] = calYaxis(data)
      console.log([lineMax, lineMin, barMax, barMin])
      const isMinNeg = lineMin < 0 || barMin < 0 ? true : false

      myChart.hideLoading();
      myChart.setOption({
        legend: {
          type: "scroll",
          width: 1000,
          top: '0%',
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params, ticket, callback) => {

            const barLength = params.filter((item) => { return item.seriesType === 'bar' ? true : false }).length
            // console.log('barLength',barLength)
            return `${params[0].axisValue}<br />
            ${params.map((item, index) => {

              if (item.seriesType === 'line') {
                return item.marker + item.seriesName + ': ' + toChartData(item.data[index - barLength + 1], chartData.line_data_per)
              }
              return item.marker + item.seriesName + ': ' + toChartData(item.data[index + 1])
            }).join('<br />')}`;
          },
          position: function (pos, params, dom, rect, size) {
            // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
            const [width, height] = size.viewSize;
            const obj = { top: 50 };
            const current = pos[0]
            if (current < 0.25 * width) { obj['left'] = 0.25 * width }
            // else if (current < 0.5*width) {obj['right']=0.75*width}
            else if (current < 0.5 * width) { obj['left'] = 0.5 * width }
            else if (current < 0.75 * width) { obj['left'] = 0.75 * width }
            else { obj['right'] = 0.25 * width }
            return obj;
          },
          transitionDuration: 1.2 //跟随鼠标延迟
        },
        toolbox: {
          orient:'vertical',
          showTitle:false,
          feature: {
            dataZoom: {},
            dataView: { show: true, readOnly: false },
            saveAsImage: { show: true }
          }
        },
        dataset: [
          {
            source: chartData.bar_data
          },
          {
            source: chartData.line_data
          },
        ],
        grid: {
          left: '5%',
          right: chartData.line_data.length ? '5%' : '4%',
          bottom: '16%',
          top: '5%',
        },
        xAxis: {
          type: 'category',
          axisPointer: {
            type: 'shadow'
          }
        },
        yAxis: [
          {
            type: 'value',
            max: barMax * 1.1,
            min: !isMinNeg ? 0 : -barMax * 1.1,
            interval: !isMinNeg ? barMax * 1.1 / 5 : barMax * 1.1 / 3,
            axisLabel: {
              formatter: function (value) {
                let val = Math.abs(value)
                if (val >= 1000000) {
                  return keepTwoDecimal(value / 1000000) + 'M'
                }
                else if (val >= 1000) {
                  return keepTwoDecimal(value / 1000) + 'k'
                }
                return keepTwoDecimal(value)
              }
            },


          },
          {
            type: 'value',
            max: lineMax * 1.1,
            min: !isMinNeg ? 0 : -lineMax * 1.1,
            interval: !isMinNeg ? lineMax * 1.1 / 5 : lineMax * 1.1 / 3,
            axisLabel: chartData.line_data_per
              ? {
                formatter: function (value) {
                  return toPercentageChart(value)
                }
              }
              : {
                formatter: function (value) {
                  let val = Math.abs(value)
                  if (val >= 1000000) {
                    return keepTwoDecimal(value / 1000000) + 'M'
                  }
                  else if (val >= 1000) {
                    return keepTwoDecimal(value / 1000) + 'k'
                  }
                  return keepTwoDecimal(value)
                }
              }
          }
        ],
        dataZoom: [
          {
            type: 'slider',
            height: 20,
            bottom: '1%',
            xAxisIndex: [0],
            start: 0,
            end: 100
          },
          {
            type: 'inside',//这个 dataZoom 组件是 inside 型 dataZoom 组件（能在坐标系内进行拖动，以及用滚轮（或移动触屏上的两指滑动）进行缩放）
            xAxisIndex: 0,//控制x轴
            start: 0,
            end: 0
          },
        ],

        series: (function () {
          let barSeries = []
          if (chartData.bar_data.length !== 0) {
            barSeries = chartData.bar_data[0].map(s => ({
              type: 'bar',
              smooth:true,
              stack: 'same',
              color:'rgba(102, 186, 228, 0.7)',
              barMaxWidth: 45,
              datasetIndex: 0,
              itemStyle: {
                color: function (params) {
                  if(chartData.highlight_index &&chartData.highlight_index[0]===params.dataIndex){return '#E84C85'}
                  return 'rgba(102, 186, 228,0.7)'
                }
              },
              markLine: data?.highlight_index?.length?{
                symbol: ['none', 'none'],
                label: { show: false,color:'red' },
                data: [
                  {xAxis: data.highlight_index[0]},
                ],
                lineStyle: { color: 'red', join: 'round' , width:1.5},
                animationDelay:800
              }:
              null
            }))
          }

          let lineSeries = []
          if (chartData.line_data.length !== 0) {
            lineSeries = chartData.line_data[0].map((s, idx) => ({
              type: 'line',
              color: 'rgba(151, 158, 224, 0.7)',
              datasetIndex: 1,
              yAxisIndex: 1,
              symbol: 'circle',
              lineStyle: { width: 1 },
              symbolSize: function (val,params) {
                if(chartData.highlight_index && chartData.highlight_index[0]===params.dataIndex){return 10}
                return 4
              },
              itemStyle:{
                color: function (params) {
                  if(chartData.highlight_index && chartData.highlight_index[0]===params.dataIndex){return 'red'}
                  return 'rgba(88, 97, 132, 0.3)'
                },
              }
            }))
          }
          barSeries.shift()
          lineSeries.shift()
          return barSeries.concat(lineSeries)

        })()
      }, true); //legend变化不更新，必须加true

      window.addEventListener("resize", () => {myChart.resize()});

    } else {
      myChart.showLoading();
    }
  }, [data, isPer])

  console.log('当前图的id', `main${index}`)

  return (
    <div id={'main' + index} style={{ height: '500px', width: '100%' }} ></div>
  )
};


export default BarLineFraud;

//